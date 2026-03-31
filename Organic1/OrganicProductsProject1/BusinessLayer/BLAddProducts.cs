using System.Data;
using Microsoft.Data.SqlClient;
using OrganicProductsProject1.DataLayer;
using OrganicProductsProject1.Models;

namespace OrganicProductsProject1.BusinessLayer
{
    public class ProductBL
    {
        private readonly SqlServerDB _db;

        public ProductBL(SqlServerDB db)
        {
            _db = db;
        }

        // Add Product
        public int AddProduct(AddProduct product)
        {
            string query = @"INSERT INTO ADDPRODUCT(NAME,PRICE,STOCK,CATEGORY,IMAGE)
                             VALUES(@Name,@Price,@Stock,@Category,@Image)";

            // Handle null image
            object imageParam = product.Image ?? (object)DBNull.Value;

            SqlParameter[] parameters =
            {
                new SqlParameter("@Name", product.Name),
                new SqlParameter("@Price", product.Price),
                new SqlParameter("@Stock", product.Stock),
                new SqlParameter("@Category", product.Category),
                new SqlParameter("@Image", SqlDbType.VarBinary, -1) { Value = imageParam }
            };

            return _db.ExecuteNonQuery(query, CommandType.Text, parameters);
        }

        // Get All Products (with optional filtering)
        public DataTable GetProducts(string? category = null, decimal? minPrice = null, decimal? maxPrice = null)
        {
            string query = "SELECT * FROM ADDPRODUCT WHERE 1=1";
            var parameters = new System.Collections.Generic.List<SqlParameter>();

            if (!string.IsNullOrEmpty(category))
            {
                query += " AND CATEGORY = @Category";
                parameters.Add(new SqlParameter("@Category", category));
            }
            if (minPrice.HasValue)
            {
                query += " AND PRICE >= @MinPrice";
                parameters.Add(new SqlParameter("@MinPrice", minPrice.Value));
            }
            if (maxPrice.HasValue)
            {
                query += " AND PRICE <= @MaxPrice";
                parameters.Add(new SqlParameter("@MaxPrice", maxPrice.Value));
            }

            return parameters.Count > 0 
                ? _db.GetDataTable(query, CommandType.Text, parameters.ToArray())
                : _db.GetDataTable(query);
        }
        
        // Get single product
        public DataRow? GetProductById(int id)
        {
            string query = "SELECT * FROM ADDPRODUCT WHERE ID = @Id";
            SqlParameter[] parameters = { new SqlParameter("@Id", id) };
            DataTable dt = _db.GetDataTable(query, CommandType.Text, parameters);
            
            if (dt.Rows.Count > 0) return dt.Rows[0];
            return null;
        }

        // Delete Product
        public int DeleteProduct(int id)
        {
            string query = "DELETE FROM ADDPRODUCT WHERE ID=@Id";

            SqlParameter[] parameters =
            {
                new SqlParameter("@Id", id)
            };

            return _db.ExecuteNonQuery(query, CommandType.Text, parameters);
        }

        public int UpdateProduct(AddProduct product)
        {
            string query = @"UPDATE ADDPRODUCT 
                             SET NAME=@Name,PRICE=@Price,STOCK=@Stock,CATEGORY=@Category" + 
                             (product.Image != null ? ",IMAGE=@Image" : "") + 
                             " WHERE ID=@Id";

            var parameters = new System.Collections.Generic.List<SqlParameter>
            {
                new SqlParameter("@Id", product.Id),
                new SqlParameter("@Name", product.Name),
                new SqlParameter("@Price", product.Price),
                new SqlParameter("@Stock", product.Stock),
                new SqlParameter("@Category", product.Category)
            };

            if (product.Image != null)
            {
                parameters.Add(new SqlParameter("@Image", SqlDbType.VarBinary, -1) { Value = product.Image });
            }

            return _db.ExecuteNonQuery(query, CommandType.Text, parameters.ToArray());
        }

        // Get only image bytes
        public byte[]? GetProductImage(int id)
        {
            string query = "SELECT IMAGE FROM ADDPRODUCT WHERE ID = @Id";
            SqlParameter[] parameters = { new SqlParameter("@Id", id) };
            object? result = _db.ExecuteScalar(query, CommandType.Text, parameters);
            
            if (result != null && result != DBNull.Value)
            {
                return (byte[])result;
            }
            return null;
        }
    }
}