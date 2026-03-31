using System.Data;
using Microsoft.Data.SqlClient;
using OrganicProductsProject1.DataLayer;
using OrganicProductsProject1.Models;

namespace OrganicProductsProject1.BusinessLayer
{
    public class BLWishlist
    {
        private readonly SqlServerDB _db;

        public BLWishlist(SqlServerDB db)
        {
            _db = db;
        }

        public DataTable GetWishlist(int userId)
        {
            string query = @"SELECT w.Id, w.ProductId, w.CreatedAt, p.NAME, p.PRICE, p.CATEGORY
                             FROM Wishlist w
                             LEFT JOIN ADDPRODUCT p ON w.ProductId = p.ID
                             WHERE w.UserId = @UserId";
            SqlParameter[] parameters = { new SqlParameter("@UserId", userId) };
            return _db.GetDataTable(query, CommandType.Text, parameters);
        }

        public int AddToWishlist(WishlistItem item)
        {
            string checkQuery = "SELECT Id FROM Wishlist WHERE UserId = @UserId AND ProductId = @ProductId";
            SqlParameter[] checkParams = {
                new SqlParameter("@UserId", item.UserId),
                new SqlParameter("@ProductId", item.ProductId)
            };
            
            var existing = _db.ExecuteScalar(checkQuery, CommandType.Text, checkParams);
            if (existing != null) return 0; // Already in wishlist

            string query = "INSERT INTO Wishlist(UserId, ProductId) VALUES(@UserId, @ProductId)";
            SqlParameter[] parameters = {
                new SqlParameter("@UserId", item.UserId),
                new SqlParameter("@ProductId", item.ProductId)
            };

            return _db.ExecuteNonQuery(query, CommandType.Text, parameters);
        }

        public int RemoveFromWishlist(int productId, int userId)
        {
            string query = "DELETE FROM Wishlist WHERE ProductId = @ProductId AND UserId = @UserId";
            SqlParameter[] parameters = {
                new SqlParameter("@ProductId", productId),
                new SqlParameter("@UserId", userId)
            };
            return _db.ExecuteNonQuery(query, CommandType.Text, parameters);
        }
    }
}
