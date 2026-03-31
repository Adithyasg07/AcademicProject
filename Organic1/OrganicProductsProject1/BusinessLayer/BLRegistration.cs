using System;
using System.Data;
using Microsoft.Data.SqlClient;
using OrganicProductsProject1.DataLayer;
using OrganicProductsProject1.Models;

namespace OrganicProductsProject1.BusinessLayer
{
    public class BLRegistration
    {
        private readonly SqlServerDB _db;

        public BLRegistration(SqlServerDB db)
        {
            _db = db;
        }

        // Registration
        public bool RegisterValues(RegistrationClass registration)
        {
            // Hash password with BCrypt
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(registration.PASSWORD);

            // Use direct SQL INSERT to avoid stored procedure truncating the hash
            string query = @"INSERT INTO REGISTRATION (NAME, EMAIL, PASSWARD, MOBILENUMBER, ROLE) 
                             VALUES (@NAME, @EMAIL, @PASSWARD, @MOBILENUMBER, @ROLE)";

            SqlParameter[] sqlParameters = new SqlParameter[]
            {
                new SqlParameter("@NAME", registration.NAME),
                new SqlParameter("@EMAIL", registration.EMAIL),
                new SqlParameter("@PASSWARD", SqlDbType.VarChar, 255) { Value = hashedPassword },
                new SqlParameter("@MOBILENUMBER", (object?)registration.MOBILENUMBER ?? DBNull.Value),
                new SqlParameter("@ROLE", 0) // Default role for new users
            };

            try 
            {
                int result = _db.ExecuteNonQuery(query, CommandType.Text, sqlParameters);
                return result > 0;
            }
            catch (SqlException ex) when (ex.Number == 2627 || ex.Number == 2601)
            {
                // Unique constraint violation (duplicate email)
                return false;
            }
        }

        // Login - Returns user details if valid
        public DataRow? Login(LoginClass login)
        {
            // Fetch user by email
            string query = "SELECT USERID, NAME, EMAIL, PASSWARD, ROLE FROM REGISTRATION WHERE EMAIL = @EMAIL";
            SqlParameter[] sqlParameters = new SqlParameter[]
            {
                new SqlParameter("@EMAIL", login.Email)
            };

            DataTable dt = _db.GetDataTable(query, CommandType.Text, sqlParameters);

            if (dt.Rows.Count > 0)
            {
                DataRow userRow = dt.Rows[0];
                string storedHash = userRow["PASSWARD"]?.ToString()?.Trim() ?? "";

                // Verify bcrypt hash (backward compatibility if plain text for existing users)
                bool validPassword = false;
                if (storedHash.StartsWith("$2a$") || storedHash.StartsWith("$2b$") || storedHash.StartsWith("$2y$")) {
                    try {
                        validPassword = BCrypt.Net.BCrypt.Verify(login.Password, storedHash);
                    } catch { validPassword = false; }
                } else {
                    validPassword = (login.Password == storedHash);
                }

                if (validPassword) return userRow; // Caller checks ROLE for blocked
            }

            return null; // Invalid email or password
        }

        // Update Profile
        public bool UpdateProfile(int userId, string name, string email, string? password)
        {
            // 1. Check if new email is already taken by ANOTHER user
            string checkQuery = "SELECT COUNT(*) FROM REGISTRATION WHERE EMAIL = @EMAIL AND USERID != @USERID";
            SqlParameter[] checkParams = {
                new SqlParameter("@EMAIL", email),
                new SqlParameter("@USERID", userId)
            };
            
            int count = Convert.ToInt32(_db.ExecuteScalar(checkQuery, CommandType.Text, checkParams));
            if (count > 0) return false; // Email already in use

            // 2. Prepare update query
            string query = "UPDATE REGISTRATION SET NAME = @NAME, EMAIL = @EMAIL";
            List<SqlParameter> parameters = new List<SqlParameter>
            {
                new SqlParameter("@NAME", name),
                new SqlParameter("@EMAIL", email),
                new SqlParameter("@USERID", userId)
            };

            if (!string.IsNullOrEmpty(password))
            {
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
                query += ", PASSWARD = @PASSWARD";
                parameters.Add(new SqlParameter("@PASSWARD", SqlDbType.VarChar, 255) { Value = hashedPassword });
            }

            query += " WHERE USERID = @USERID";

            int rows = _db.ExecuteNonQuery(query, CommandType.Text, parameters.ToArray());
            return rows > 0;
        }

        public DataRow? GetUserById(int userId)
        {
            string query = "SELECT USERID, NAME, EMAIL, ROLE FROM REGISTRATION WHERE USERID = @USERID";
            SqlParameter[] sqlParameters = { new SqlParameter("@USERID", userId) };
            DataTable dt = _db.GetDataTable(query, CommandType.Text, sqlParameters);
            return dt.Rows.Count > 0 ? dt.Rows[0] : null;
        }
    }
}