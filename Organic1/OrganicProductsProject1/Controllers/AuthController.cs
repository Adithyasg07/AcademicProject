using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using OrganicProductsProject1.BusinessLayer;
using OrganicProductsProject1.Models;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace OrganicProductsProject1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly BLRegistration _authBL;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;
 
        public AuthController(BLRegistration authBL, IConfiguration configuration, ILogger<AuthController> logger)
        {
            _authBL = authBL;
            _configuration = configuration;
            _logger = logger;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegistrationClass registration)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                bool result = _authBL.RegisterValues(registration);
                if (result)
                {
                    _logger.LogInformation("New user registered: {Email}", registration.EMAIL);
                    return Ok(new { message = "User Registered Successfully" });
                }
                _logger.LogWarning("Registration failed for {Email}: Email already exists", registration.EMAIL);
                return BadRequest(new { message = "Registration Failed. Email might already exist." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server Error", error = ex.Message });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginClass login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            DataRow? user = _authBL.Login(login);

            if (user != null)
            {
                int role = user["ROLE"] == DBNull.Value ? 0 : Convert.ToInt32(user["ROLE"]);

                // Check if user is blocked
                if (role == -1)
                {
                    return StatusCode(403, new { message = "Your account has been blocked. Contact admin." });
                }

                // Generate JWT
                var token = GenerateJwtToken(user);
                
                _logger.LogInformation("User logged in: {Email} with role {Role}", login.Email, role == 1 ? "Admin" : "User");
                return Ok(new 
                { 
                    message = "Login Successful", 
                    token = token,
                    user = new {
                        id = Convert.ToInt32(user["USERID"]),
                        name = user["NAME"].ToString(),
                        email = user["EMAIL"].ToString(),
                        role = role == 1 ? "Admin" : "User"
                    }
                });
            }

            _logger.LogWarning("Failed login attempt for {Email}", login.Email);
            return Unauthorized(new { message = "Invalid Email or Password" });
        }

        private string GenerateJwtToken(DataRow user)
        {
            var jwtKey = _configuration["Jwt:Key"];
            var jwtIssuer = _configuration["Jwt:Issuer"];
            var jwtAudience = _configuration["Jwt:Audience"];
            
            var role = (user["ROLE"] == DBNull.Value ? 0 : Convert.ToInt32(user["ROLE"])) == 1 ? "Admin" : "User";

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user["USERID"].ToString()!),
                new Claim(JwtRegisteredClaimNames.Sub, user["USERID"].ToString()!),
                new Claim(JwtRegisteredClaimNames.Email, user["EMAIL"].ToString()!),
                new Claim("name", user["NAME"].ToString()!),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPut("profile")]
        [Authorize]
        public IActionResult UpdateProfile([FromBody] ProfileUpdateRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            int userId = GetUserId();
            bool result = _authBL.UpdateProfile(userId, request.Name, request.Email, request.Password);

            if (!result) return BadRequest(new { message = "Update failed. Email might already be in use." });

            // Fetch updated user to generate new token
            DataRow? updatedUser = _authBL.GetUserById(userId);
            if (updatedUser == null) return NotFound(new { message = "User not found after update." });

            var token = GenerateJwtToken(updatedUser);

            return Ok(new 
            { 
                message = "Profile updated successfully", 
                token = token,
                user = new {
                    id = Convert.ToInt32(updatedUser["USERID"]),
                    name = updatedUser["NAME"].ToString(),
                    email = updatedUser["EMAIL"].ToString(),
                    role = (updatedUser["ROLE"] == DBNull.Value ? 0 : Convert.ToInt32(updatedUser["ROLE"])) == 1 ? "Admin" : "User"
                }
            });
        }
    }
}
