using System.Data;
using Microsoft.Data.SqlClient;
using OrganicProductsProject1.DataLayer;
using OrganicProductsProject1.Models;

namespace OrganicProductsProject1.BusinessLayer
{
    public class BLCart
    {
        private readonly SqlServerDB _db;

        public BLCart(SqlServerDB db)
        {
            _db = db;
        }

        public DataTable GetCart(int userId)
        {
            string query = "SELECT * FROM Cart WHERE UserId = @UserId";
            SqlParameter[] parameters = { new SqlParameter("@UserId", userId) };
            return _db.GetDataTable(query, CommandType.Text, parameters);
        }

        public int AddToCart(CartItem item)
        {
            // Check if item already exists in cart with same size
            string checkQuery = "SELECT Id, Quantity FROM Cart WHERE UserId = @UserId AND ProductId = @ProductId AND Size = @Size";
            SqlParameter[] checkParams = {
                new SqlParameter("@UserId", item.UserId),
                new SqlParameter("@ProductId", item.ProductId),
                new SqlParameter("@Size", item.Size)
            };
            
            DataTable exists = _db.GetDataTable(checkQuery, CommandType.Text, checkParams);
            
            if (exists.Rows.Count > 0)
            {
                // Update quantity
                int existingId = Convert.ToInt32(exists.Rows[0]["Id"]);
                int newQuantity = Convert.ToInt32(exists.Rows[0]["Quantity"]) + item.Quantity;
                
                string updateQuery = "UPDATE Cart SET Quantity = @Quantity WHERE Id = @Id";
                SqlParameter[] updateParams = {
                    new SqlParameter("@Quantity", newQuantity),
                    new SqlParameter("@Id", existingId)
                };
                _db.ExecuteNonQuery(updateQuery, CommandType.Text, updateParams);
                return existingId;
            }

            string query = @"INSERT INTO Cart(UserId, ProductId, ProductName, Quantity, Size, Price) 
                             VALUES(@UserId, @ProductId, @ProductName, @Quantity, @Size, @Price);
                             SELECT SCOPE_IDENTITY();";
                             
            SqlParameter[] parameters = {
                new SqlParameter("@UserId", item.UserId),
                new SqlParameter("@ProductId", item.ProductId),
                new SqlParameter("@ProductName", item.ProductName),
                new SqlParameter("@Quantity", item.Quantity),
                new SqlParameter("@Size", item.Size),
                new SqlParameter("@Price", item.Price)
            };

            var idResult = _db.ExecuteScalar(query, CommandType.Text, parameters);
            return idResult != null ? Convert.ToInt32(idResult) : 0;
        }

        public int UpdateQuantity(int id, int userId, int quantity)
        {
            string query = "UPDATE Cart SET Quantity = @Quantity WHERE Id = @Id AND UserId = @UserId";
            SqlParameter[] parameters = {
                new SqlParameter("@Id", id),
                new SqlParameter("@UserId", userId),
                new SqlParameter("@Quantity", quantity)
            };
            return _db.ExecuteNonQuery(query, CommandType.Text, parameters);
        }

        public int RemoveFromCart(int id, int userId)
        {
            string query = "DELETE FROM Cart WHERE Id = @Id AND UserId = @UserId";
            SqlParameter[] parameters = {
                new SqlParameter("@Id", id),
                new SqlParameter("@UserId", userId)
            };
            return _db.ExecuteNonQuery(query, CommandType.Text, parameters);
        }

        public int ClearCart(int userId)
        {
            string query = "DELETE FROM Cart WHERE UserId = @UserId";
            SqlParameter[] parameters = { new SqlParameter("@UserId", userId) };
            return _db.ExecuteNonQuery(query, CommandType.Text, parameters);
        }
    }
}
