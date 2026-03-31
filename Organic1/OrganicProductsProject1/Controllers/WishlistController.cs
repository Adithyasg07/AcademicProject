using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrganicProductsProject1.BusinessLayer;
using OrganicProductsProject1.Models;
using System.Security.Claims;

namespace OrganicProductsProject1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WishlistController : ControllerBase
    {
        private readonly BLWishlist _wishlistBL;

        public WishlistController(BLWishlist wishlistBL)
        {
            _wishlistBL = wishlistBL;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

        [HttpGet]
        public IActionResult GetWishlist()
        {
            var dt = _wishlistBL.GetWishlist(GetUserId());
            var items = new List<Dictionary<string, object>>();
            foreach(System.Data.DataRow row in dt.Rows)
            {
                var dict = new Dictionary<string, object>();
                foreach(System.Data.DataColumn col in dt.Columns)
                {
                    if (col.ColumnName.ToUpper() != "IMAGE")
                    {
                        dict[col.ColumnName] = row[col];
                    }
                }
                dict["imageUrl"] = $"/api/Products/{row["ProductId"]}/image";
                items.Add(dict);
            }
            return Ok(items);
        }

        [HttpPost]
        public IActionResult AddToWishlist([FromBody] WishlistItem item)
        {
            item.UserId = GetUserId();
            int rows = _wishlistBL.AddToWishlist(item);
            
            if (rows == 0) return Ok(new { message = "Already in wishlist" });
            
            return Ok(new { message = "Added to wishlist" });
        }

        [HttpDelete("{productId}")]
        public IActionResult RemoveFromWishlist(int productId)
        {
            int rows = _wishlistBL.RemoveFromWishlist(productId, GetUserId());
            if (rows == 0) return NotFound(new { message = "Item not found in wishlist" });
            
            return Ok(new { message = "Removed from wishlist" });
        }
    }
}
