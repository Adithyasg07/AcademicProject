using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrganicProductsProject1.BusinessLayer;
using OrganicProductsProject1.Models;
using System.Security.Claims;

namespace OrganicProductsProject1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Requires login
    public class CartController : ControllerBase
    {
        private readonly BLCart _cartBL;

        public CartController(BLCart cartBL)
        {
            _cartBL = cartBL;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

        [HttpGet]
        public IActionResult GetCart()
        {
            var dt = _cartBL.GetCart(GetUserId());
            var items = new List<Dictionary<string, object>>();
            foreach(System.Data.DataRow row in dt.Rows)
            {
                var dict = new Dictionary<string, object>();
                foreach(System.Data.DataColumn col in dt.Columns)
                {
                    dict[col.ColumnName] = row[col];
                }
                items.Add(dict);
            }
            return Ok(items);
        }

        [HttpPost]
        public IActionResult AddToCart([FromBody] CartItem item)
        {
            item.UserId = GetUserId();
            int id = _cartBL.AddToCart(item);
            return Ok(new { message = "Added to cart", cartItemId = id });
        }

        [HttpPut("{id}")]
        public IActionResult UpdateQuantity(int id, [FromBody] CartItem item)
        {
            int rows = _cartBL.UpdateQuantity(id, GetUserId(), item.Quantity);
            if (rows == 0) return NotFound(new { message = "Item not found in your cart" });
            return Ok(new { message = "Quantity updated" });
        }

        [HttpDelete("{id}")]
        public IActionResult RemoveFromCart(int id)
        {
            int rows = _cartBL.RemoveFromCart(id, GetUserId());
            if (rows == 0) return NotFound(new { message = "Item not found in your cart" });
            return Ok(new { message = "Item removed" });
        }
    }
}
