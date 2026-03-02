namespace ECommerce.Web.Models;

public class Category
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Slug { get; set; }
    public List<Product> Products { get; set; } = new();
}
