using System.Data;
using Microsoft.Data.SqlClient;
using OrganicProductsProject1.DataLayer;

namespace OrganicProductsProject1.BusinessLayer
{
    public class BLAdmin
    {
        private readonly SqlServerDB _db;

        public BLAdmin(SqlServerDB db)
        {
            _db = db;
        }

        public DataTable GetAllUsers()
        {
            string query = "SELECT USERID as Id, NAME as Name, EMAIL as Email, MOBILENUMBER as Phone, CASE WHEN ISNULL(ROLE, 0) = -1 THEN 'Blocked' ELSE 'Active' END as Status FROM REGISTRATION WHERE ISNULL(ROLE, 0) != 1"; // Exclude admins from list
            return _db.GetDataTable(query);
        }

        public int ToggleUserStatus(int userId)
        {
            string query = "UPDATE REGISTRATION SET ROLE = CASE WHEN ROLE = 0 THEN -1 ELSE 0 END WHERE USERID = @UserId AND ROLE != 1";
            SqlParameter[] parameters = { new SqlParameter("@UserId", userId) };
            return _db.ExecuteNonQuery(query, CommandType.Text, parameters);
        }

        public Dictionary<string, object> GetDashboardStats()
        {
            var stats = new Dictionary<string, object>();
            stats["TotalProducts"] = _db.ExecuteScalar("SELECT ISNULL(COUNT(*), 0) FROM ADDPRODUCT", CommandType.Text) ?? 0;
            stats["TotalStock"] = _db.ExecuteScalar("SELECT ISNULL(SUM(STOCK), 0) FROM ADDPRODUCT", CommandType.Text) ?? 0;
            stats["TotalOrders"] = _db.ExecuteScalar("SELECT ISNULL(COUNT(*), 0) FROM Orders", CommandType.Text) ?? 0;
            stats["TotalUsers"] = _db.ExecuteScalar("SELECT COUNT(*) FROM REGISTRATION WHERE ISNULL(ROLE, 0) != 1", CommandType.Text) ?? 0;
            stats["TotalRevenue"] = _db.ExecuteScalar("SELECT ISNULL(SUM(TotalAmount), 0) FROM Orders WHERE Status != 'Cancelled'", CommandType.Text) ?? 0;
            return stats;
        }

        public DataTable GetRecentOrders(int count = 5)
        {
            string query = $@"SELECT TOP {count} o.Id, o.TotalAmount, o.Status, o.CreatedAt, r.NAME as CustomerName 
                             FROM Orders o 
                             JOIN REGISTRATION r ON o.UserId = r.USERID 
                             ORDER BY o.CreatedAt DESC";
            return _db.GetDataTable(query);
        }

        public bool AddUser(string name, string email, string password, int role)
        {
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
            string query = @"INSERT INTO REGISTRATION (NAME, EMAIL, PASSWARD, ROLE) 
                             VALUES (@NAME, @EMAIL, @PASSWARD, @ROLE)";
            
            SqlParameter[] parameters = {
                new SqlParameter("@NAME", name),
                new SqlParameter("@EMAIL", email),
                new SqlParameter("@PASSWARD", SqlDbType.VarChar, 255) { Value = hashedPassword },
                new SqlParameter("@ROLE", role)
            };

            try {
                return _db.ExecuteNonQuery(query, CommandType.Text, parameters) > 0;
            } catch {
                return false;
            }
        }
    }
}
