namespace ECommerce.Web.Models;

public class Cart
{
    public int Id { get; set; }
    public string CartKey { get; set; } = default!; // userId or anonymous key
    public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedUtc { get; set; } = DateTime.UtcNow;

    public List<CartItem> Items { get; set; } = new();
}
