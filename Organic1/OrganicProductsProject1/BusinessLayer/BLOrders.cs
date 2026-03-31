using System.Data;
using Microsoft.Data.SqlClient;
using OrganicProductsProject1.DataLayer;
using OrganicProductsProject1.Models;

namespace OrganicProductsProject1.BusinessLayer
{
    public class BLOrders
    {
        private readonly SqlServerDB _db;

        public BLOrders(SqlServerDB db)
        {
            _db = db;
        }

        public DataTable GetUserOrders(int userId)
        {
            string query = @"SELECT o.Id, o.UserId, o.CreatedAt, o.Status, o.PaymentMethod,
                                   oi.ProductName as ItemName, oi.Price as ItemPrice, 
                                   oi.Quantity, oi.Size, o.TotalAmount as OrderTotal
                            FROM Orders o
                            JOIN OrderItems oi ON o.Id = oi.OrderId
                            WHERE o.UserId = @UserId 
                            ORDER BY o.CreatedAt DESC";
            SqlParameter[] parameters = { new SqlParameter("@UserId", userId) };
            return _db.GetDataTable(query, CommandType.Text, parameters);
        }

        public DataTable GetAllOrders()
        {
            string query = @"SELECT o.*, r.NAME as CustomerName,
                                   (SELECT STRING_AGG(ProductName, ', ') FROM OrderItems WHERE OrderId = o.Id) as ItemNames
                            FROM Orders o 
                            JOIN REGISTRATION r ON o.UserId = r.USERID 
                            ORDER BY o.CreatedAt DESC";
            return _db.GetDataTable(query);
        }

        public int PlaceOrderFromCart(OrderRequest orderReq)
        {
            // Insert Order
            string orderQuery = @"INSERT INTO Orders(UserId, TotalAmount, PaymentMethod) 
                                  VALUES(@UserId, @TotalAmount, @PaymentMethod);
                                  SELECT SCOPE_IDENTITY();";
            
            SqlParameter[] orderParams = {
                new SqlParameter("@UserId", orderReq.UserId),
                new SqlParameter("@TotalAmount", orderReq.TotalAmount),
                new SqlParameter("@PaymentMethod", orderReq.PaymentMethod)
            };

            var idResult = _db.ExecuteScalar(orderQuery, CommandType.Text, orderParams);
            if (idResult == null) return 0;
            
            int orderId = Convert.ToInt32(idResult);

            // Move Cart items to OrderItems
            string moveQuery = @"INSERT INTO OrderItems (OrderId, ProductId, ProductName, Quantity, Size, Price)
                                 SELECT @OrderId, ProductId, ProductName, Quantity, Size, Price 
                                 FROM Cart WHERE UserId = @UserId";
                                 
            SqlParameter[] moveParams = {
                new SqlParameter("@OrderId", orderId),
                new SqlParameter("@UserId", orderReq.UserId)
            };
            
            _db.ExecuteNonQuery(moveQuery, CommandType.Text, moveParams);

            // Clear Cart
            string clearQuery = "DELETE FROM Cart WHERE UserId = @UserId";
            SqlParameter[] clearParams = { new SqlParameter("@UserId", orderReq.UserId) };
            _db.ExecuteNonQuery(clearQuery, CommandType.Text, clearParams);

            return orderId;
        }

        public int UpdateOrderStatus(int orderId, string status)
        {
            string query = "UPDATE Orders SET Status = @Status WHERE Id = @Id";
            SqlParameter[] parameters = {
                new SqlParameter("@Id", orderId),
                new SqlParameter("@Status", status)
            };
            return _db.ExecuteNonQuery(query, CommandType.Text, parameters);
        }

        public DataTable GetOrderItems(int orderId)
        {
            string query = "SELECT * FROM OrderItems WHERE OrderId = @OrderId";
            SqlParameter[] parameters = { new SqlParameter("@OrderId", orderId) };
            return _db.GetDataTable(query, CommandType.Text, parameters);
        }
    }
}
