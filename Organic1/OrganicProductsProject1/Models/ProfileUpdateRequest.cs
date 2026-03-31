using System.ComponentModel.DataAnnotations;

namespace OrganicProductsProject1.Models
{
    public class ProfileUpdateRequest
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? Password { get; set; }
    }
}
