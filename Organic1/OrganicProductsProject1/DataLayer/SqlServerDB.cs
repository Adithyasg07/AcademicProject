using System;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace OrganicProductsProject1.DataLayer
{
    public class SqlServerDB
    {
        private readonly string conn;

        public SqlServerDB(IConfiguration configuration)
        {
            conn = configuration.GetConnectionString("DefaultConnection")
                   ?? throw new Exception("Connection string not found in appsettings.json");
        }

        // -----------------------------
        // Method: Execute SELECT query (Text)
        // -----------------------------
        public DataTable GetDataTable(string query)
        {
            using SqlConnection sqlConn = new SqlConnection(conn);
            using SqlCommand cmd = new SqlCommand(query, sqlConn)
            {
                CommandType = CommandType.Text
            };

            using SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();
            da.Fill(dt);
            return dt;
        }

        // -----------------------------
        // Method: Execute INSERT/UPDATE/DELETE query (Text)
        // -----------------------------
        public int ExecuteOnlyQuery(string query)
        {
            using SqlConnection sqlConn = new SqlConnection(conn);
            using SqlCommand cmd = new SqlCommand(query, sqlConn)
            {
                CommandType = CommandType.Text
            };

            sqlConn.Open();
            int rowsAffected = cmd.ExecuteNonQuery();
            sqlConn.Close();
            return rowsAffected;
        }

        // -----------------------------
        // Method: Execute Stored Procedure SELECT
        // -----------------------------
        public DataTable GetDataTable(string procedureName, CommandType commandType, params SqlParameter[] parameters)
        {
            using SqlConnection sqlConn = new SqlConnection(conn);
            using SqlCommand cmd = new SqlCommand(procedureName, sqlConn)
            {
                CommandType = commandType
            };

            if (parameters != null && parameters.Length > 0)
                cmd.Parameters.AddRange(parameters);

            using SqlDataAdapter da = new SqlDataAdapter(cmd);
            DataTable dt = new DataTable();
            da.Fill(dt);
            return dt;
        }

        // -----------------------------
        // Method: Execute Stored Procedure INSERT/UPDATE/DELETE
        // -----------------------------
        public int ExecuteNonQuery(string procedureName, CommandType commandType, params SqlParameter[] parameters)
        {
            using SqlConnection sqlConn = new SqlConnection(conn);
            using SqlCommand cmd = new SqlCommand(procedureName, sqlConn)
            {
                CommandType = commandType
            };

            if (parameters != null && parameters.Length > 0)
                cmd.Parameters.AddRange(parameters);

            sqlConn.Open();
            int rowsAffected = cmd.ExecuteNonQuery();
            sqlConn.Close();
            return rowsAffected;
        }

        // -----------------------------
        // Method: Execute Stored Procedure or query returning a single value (Object)
        // Handles null/DBNull safely
        // -----------------------------
        public object? ExecuteScalar(string procedureName, CommandType commandType, params SqlParameter[] parameters)
        {
            using SqlConnection sqlConn = new SqlConnection(conn);
            using SqlCommand cmd = new SqlCommand(procedureName, sqlConn)
            {
                CommandType = commandType
            };

            if (parameters != null && parameters.Length > 0)
                cmd.Parameters.AddRange(parameters);

            sqlConn.Open();
            object? result = cmd.ExecuteScalar();
            sqlConn.Close();

            if (result == null || result == DBNull.Value)
                return null;

            return result;
        }

        // -----------------------------
        // Generic version: ExecuteScalar<T> returning typed value safely
        // -----------------------------
        public T? ExecuteScalar<T>(string procedureName, CommandType commandType, params SqlParameter[] parameters)
        {
            object? result = ExecuteScalar(procedureName, commandType, parameters);

            if (result == null)
                return default;

            return (T)Convert.ChangeType(result, typeof(T));
        }
    }
}