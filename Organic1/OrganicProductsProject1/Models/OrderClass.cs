namespace OrganicProductsProject1.Models
{
    public class OrderRequest
    {
        public int UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
    }

    public class OrderStatusUpdate
    {
        public string Status { get; set; } = string.Empty;
    }
}
