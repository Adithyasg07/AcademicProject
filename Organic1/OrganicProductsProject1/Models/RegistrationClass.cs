using System.ComponentModel.DataAnnotations;

namespace OrganicProductsProject1.Models
{
    public class RegistrationClass
    {
        public int USERID { get; set; }

        [Required]
        [StringLength(100)]
        public required string NAME { get; set; }

        [Required]
        [EmailAddress]
        public required string EMAIL { get; set; }

        [Required]
        [MinLength(6)]
        public required string PASSWORD { get; set; }

        [Required]
        [StringLength(15)]
        public required string MOBILENUMBER { get; set; }

        public int ROLE { get; set; } = 0;
    }
}
