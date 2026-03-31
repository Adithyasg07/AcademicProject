using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrganicProductsProject1.BusinessLayer;
using System.Data;

namespace OrganicProductsProject1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly BLAdmin _adminBL;

        public AdminController(BLAdmin adminBL)
        {
            _adminBL = adminBL;
        }

        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            var dt = _adminBL.GetAllUsers();
            var items = new List<Dictionary<string, object?>>();
            foreach (DataRow row in dt.Rows)
            {
                var dict = new Dictionary<string, object?>();
                foreach (DataColumn col in dt.Columns) dict[col.ColumnName] = row[col] == DBNull.Value ? null : row[col];
                items.Add(dict);
            }
            return Ok(items);
        }

        [HttpPut("users/{id}/status")]
        public IActionResult ToggleUserStatus(int id)
        {
            int rows = _adminBL.ToggleUserStatus(id);
            if (rows == 0) return NotFound(new { message = "User not found or cannot be modified" });
            return Ok(new { message = "User status updated" });
        }

        [HttpGet("stats")]
        public IActionResult GetStats()
        {
            return Ok(_adminBL.GetDashboardStats());
        }

        [HttpGet("recent-orders")]
        public IActionResult GetRecentOrders()
        {
            var dt = _adminBL.GetRecentOrders();
            var items = new List<Dictionary<string, object?>>();
            foreach (DataRow row in dt.Rows)
            {
                var dict = new Dictionary<string, object?>();
                foreach (DataColumn col in dt.Columns) dict[col.ColumnName] = row[col] == DBNull.Value ? null : row[col];
                items.Add(dict);
            }
            return Ok(items);
        }

        [HttpPost("users")]
        public IActionResult CreateUser([FromBody] UserCreateRequest req)
        {
            bool success = _adminBL.AddUser(req.Name, req.Email, req.Password, req.Role);
            if (!success) return BadRequest(new { message = "Failed to create user. Email may already exist." });
            return Ok(new { message = "User created successfully" });
        }
    }

    public class UserCreateRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int Role { get; set; } // 0 for User, 1 for Admin, etc.
    }
}
