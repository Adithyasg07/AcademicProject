using System;
using System.Data;
using Microsoft.Data.SqlClient;

class Checker
{
    static void Main()
    {
        string connStr = "Server=(localdb)\\MSSQLLocalDB;Database=OrganicProductsDB;Trusted_Connection=True;";
        try
        {
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                conn.Open();
                string query = "SELECT ID, NAME FROM ADDPRODUCT";
                SqlCommand cmd = new SqlCommand(query, conn);
                SqlDataReader reader = cmd.ExecuteReader();
                Console.WriteLine("Existing IDs in ADDPRODUCT:");
                while (reader.Read())
                {
                    Console.WriteLine($"{reader["ID"]}: {reader["NAME"]}");
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error: " + ex.Message);
        }
    }
}
