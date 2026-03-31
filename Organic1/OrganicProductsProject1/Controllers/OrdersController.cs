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
    public class OrdersController : ControllerBase
    {
        private readonly BLOrders _ordersBL;

        public OrdersController(BLOrders ordersBL)
        {
            _ordersBL = ordersBL;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

        [HttpGet]
        public IActionResult GetUserOrders()
        {
            var dt = _ordersBL.GetUserOrders(GetUserId());
            var items = new List<Dictionary<string, object>>();
            foreach(System.Data.DataRow row in dt.Rows)
            {
                var dict = new Dictionary<string, object>();
                foreach(System.Data.DataColumn col in dt.Columns) dict[col.ColumnName] = row[col];
                items.Add(dict);
            }
            return Ok(items);
        }

        [HttpPost]
        public IActionResult PlaceOrder([FromBody] OrderRequest orderReq)
        {
            orderReq.UserId = GetUserId();
            int orderId = _ordersBL.PlaceOrderFromCart(orderReq);
            
            if (orderId == 0) return BadRequest(new { message = "Failed to place order. Is your cart empty?" });
            
            return Ok(new { message = "Order placed successfully", orderId });
        }

        // Admin Endpoints
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllOrders()
        {
            var dt = _ordersBL.GetAllOrders();
            var items = new List<Dictionary<string, object>>();
            foreach(System.Data.DataRow row in dt.Rows)
            {
                var dict = new Dictionary<string, object>();
                foreach(System.Data.DataColumn col in dt.Columns) dict[col.ColumnName] = row[col];
                items.Add(dict);
            }
            return Ok(items);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateStatus(int id, [FromBody] OrderStatusUpdate update)
        {
            int rows = _ordersBL.UpdateOrderStatus(id, update.Status);
            if (rows == 0) return NotFound(new { message = "Order not found" });
            return Ok(new { message = "Order status updated" });
        }

        [HttpGet("{id}/items")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetOrderItems(int id)
        {
            var dt = _ordersBL.GetOrderItems(id);
            var items = new List<Dictionary<string, object>>();
            foreach (System.Data.DataRow row in dt.Rows)
            {
                var dict = new Dictionary<string, object>();
                foreach (System.Data.DataColumn col in dt.Columns) dict[col.ColumnName] = row[col];
                items.Add(dict);
            }
            return Ok(items);
        }
    }
}
