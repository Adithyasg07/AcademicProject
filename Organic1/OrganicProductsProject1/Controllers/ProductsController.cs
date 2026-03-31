using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrganicProductsProject1.BusinessLayer;
using OrganicProductsProject1.Models;
using System.Data;

namespace OrganicProductsProject1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class ProductsController : ControllerBase
    {
        private readonly ProductBL _productBL;
        private readonly ILogger<ProductsController> _logger;
 
        public ProductsController(ProductBL productBL, ILogger<ProductsController> logger)
        {
            _productBL = productBL;
            _logger = logger;
        }

        // GET: api/products
        [HttpGet]
        public IActionResult GetAll([FromQuery] string? category, [FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice)
        {
            DataTable products = _productBL.GetProducts(category, minPrice, maxPrice);
            
            var productList = new List<Dictionary<string, object?>>();
            foreach (DataRow row in products.Rows)
            {
                var dict = new Dictionary<string, object?>();
                foreach (DataColumn col in products.Columns)
                {
                    // Exclude the raw IMAGE binary data from the list to avoid memory/timeout issues
                    if (col.ColumnName.ToUpper() != "IMAGE")
                    {
                        dict[col.ColumnName] = row[col] == DBNull.Value ? null : row[col];
                    }
                }
                // Add a helper URL for the frontend to fetch the image
                dict["imageUrl"] = $"/api/Products/{row["ID"]?.ToString()}/image";
                productList.Add(dict);
            }

            return Ok(productList);
        }

        // GET: api/products/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            DataRow? product = _productBL.GetProductById(id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found" });
            }

            var dict = new Dictionary<string, object?>();
            foreach (DataColumn col in product.Table.Columns)
            {
                if (col.ColumnName.ToUpper() != "IMAGE")
                {
                    dict[col.ColumnName] = product[col] == DBNull.Value ? null : product[col];
                }
            }
            dict["imageUrl"] = $"/api/Products/{product["ID"]?.ToString()}/image";

            return Ok(dict);
        }

        // GET: api/products/5/image
        [HttpGet("{id}/image")]
        public IActionResult GetImage(int id)
        {
            byte[]? imageBytes = _productBL.GetProductImage(id);
            if (imageBytes == null || imageBytes.Length == 0)
            {
                return NotFound();
            }
            return File(imageBytes, "image/jpeg");
        }

        // POST: api/products
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult Create([FromForm] AddProduct product, IFormFile? imageFile)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (imageFile != null && imageFile.Length > 0)
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    imageFile.CopyTo(ms);
                    product.Image = ms.ToArray();
                }
            }

            int id = _productBL.AddProduct(product);
            _logger.LogInformation("Product created successfully with ID: {Id} by Admin", id);
            return CreatedAtAction(nameof(GetById), new { id = id }, new { message = "Product added successfully", id });
        }

        // PUT: api/products/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Update(int id, [FromForm] AddProduct product, IFormFile? imageFile)
        {
            if (id != product.Id)
            {
                return BadRequest(new { message = "ID mismatch" });
            }

            if (imageFile != null && imageFile.Length > 0)
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    imageFile.CopyTo(ms);
                    product.Image = ms.ToArray();
                }
            }

            int rows = _productBL.UpdateProduct(product);
            if (rows == 0) 
            {
                _logger.LogWarning("Update failed: Product {Id} not found", id);
                return NotFound(new { message = "Product not found" });
            }

            _logger.LogInformation("Product {Id} updated successfully", id);
            return Ok(new { message = "Product updated successfully" });
        }

        // DELETE: api/products/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(int id)
        {
            int rows = _productBL.DeleteProduct(id);
            if (rows == 0) 
            {
                _logger.LogWarning("Delete failed: Product {Id} not found", id);
                return NotFound(new { message = "Product not found" });
            }

            _logger.LogInformation("Product {Id} deleted successfully", id);
            return Ok(new { message = "Product deleted successfully" });
        }
    }
}
