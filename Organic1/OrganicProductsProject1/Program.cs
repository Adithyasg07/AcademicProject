using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using OrganicProductsProject1.BusinessLayer;
using OrganicProductsProject1.DataLayer;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "Organic Products API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference { Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new string[] { }
        }
    });

    // Handle schema conflicts and ambiguous routes
    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
    c.CustomSchemaIds(type => type.FullName);
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 104857600; // 100 MB
});

// Dependency Injection
builder.Services.AddScoped<SqlServerDB>();
builder.Services.AddScoped<BLRegistration>();
builder.Services.AddScoped<ProductBL>();
builder.Services.AddScoped<BLCart>();
builder.Services.AddScoped<BLOrders>();
builder.Services.AddScoped<BLWishlist>();
builder.Services.AddScoped<BLAdmin>();

// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://localhost:5175")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!))
        };
    });

var app = builder.Build();

// Swagger
app.UseSwagger();
app.UseSwaggerUI();

// Configure Global Exception Handler (Professional JSON response)
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exceptionHandlerPathFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
        var exception = exceptionHandlerPathFeature?.Error;

        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";

        var response = new
        {
            status = 500,
            message = "An unexpected server error occurred.",
            detail = exception?.Message
        };

        await context.Response.WriteAsJsonAsync(response);
    });
});

// Run automatic database migrations on startup
using (var scope = app.Services.CreateScope())
{
    try 
    {
        var db = scope.ServiceProvider.GetRequiredService<SqlServerDB>();
        
        // 1. Expand password column to support BCrypt hashes (60 chars)
        db.ExecuteNonQuery(
            "IF COL_LENGTH('REGISTRATION','PASSWARD') < 255 ALTER TABLE REGISTRATION ALTER COLUMN PASSWARD VARCHAR(255)",
            System.Data.CommandType.Text);

        // 2. Create Cart table if it doesn't exist
        db.ExecuteNonQuery(@"
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Cart' AND xtype='U')
            CREATE TABLE Cart (
                Id INT IDENTITY(1,1) PRIMARY KEY,
                UserId INT NOT NULL,
                ProductId INT NOT NULL,
                ProductName NVARCHAR(200) NOT NULL,
                Quantity INT NOT NULL DEFAULT 1,
                Size NVARCHAR(50) NOT NULL,
                Price DECIMAL(10,2) NOT NULL,
                CreatedAt DATETIME DEFAULT GETDATE()
            )", System.Data.CommandType.Text);

        // 3. Create Orders table if it doesn't exist  
        db.ExecuteNonQuery(@"
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Orders' AND xtype='U')
            CREATE TABLE Orders (
                Id INT IDENTITY(1,1) PRIMARY KEY,
                UserId INT NOT NULL,
                TotalAmount DECIMAL(10,2) NOT NULL,
                PaymentMethod NVARCHAR(50) NOT NULL DEFAULT 'COD',
                Status NVARCHAR(50) NOT NULL DEFAULT 'Pending',
                CreatedAt DATETIME DEFAULT GETDATE()
            )", System.Data.CommandType.Text);

        // 4. Create OrderItems table if it doesn't exist
        db.ExecuteNonQuery(@"
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='OrderItems' AND xtype='U')
            CREATE TABLE OrderItems (
                Id INT IDENTITY(1,1) PRIMARY KEY,
                OrderId INT NOT NULL,
                ProductId INT NOT NULL,
                ProductName NVARCHAR(200) NOT NULL,
                Quantity INT NOT NULL,
                Size NVARCHAR(50) NOT NULL,
                Price DECIMAL(10,2) NOT NULL
            )", System.Data.CommandType.Text);

        // 5. Create Wishlist table if it doesn't exist
        db.ExecuteNonQuery(@"
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Wishlist' AND xtype='U')
            CREATE TABLE Wishlist (
                Id INT IDENTITY(1,1) PRIMARY KEY,
                UserId INT NOT NULL,
                ProductId INT NOT NULL,
                CreatedAt DATETIME DEFAULT GETDATE(),
                CONSTRAINT UQ_Wishlist UNIQUE(UserId, ProductId)
            )", System.Data.CommandType.Text);

        Console.WriteLine("✅ Database migration completed successfully.");
    } 
    catch(Exception ex) 
    {
        Console.WriteLine("⚠️ Database migration warning: " + ex.Message);
    }
}

// app.UseHttpsRedirection();

app.UseCors("MyCorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();