using System.ComponentModel.DataAnnotations;

namespace OrganicProductsProject1.Models
{
    public class AddProduct
    {
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required]
        public int Stock { get; set; }

        [Required]
        public required string Category { get; set; }

        public byte[]? Image { get; set; }
    }
}