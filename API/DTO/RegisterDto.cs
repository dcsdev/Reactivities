using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class RegisterDto
    {
        [Required]
       public string DisplayName {get;set;} 
       
       [Required]
       [EmailAddress]
       public string Email {get;set;}
       
       [Required]
       [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$", ErrorMessage = "Password Must Be Complex")]
       public string Password {get;set;}
       public string UserName {get;set;}
    }
}