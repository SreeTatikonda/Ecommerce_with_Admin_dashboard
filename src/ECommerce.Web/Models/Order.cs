namespace ECommerce.Web.Models;

public enum OrderStatus
{
    PendingPayment = 0,
    Paid = 1,
    Processing = 2,
    Shipped = 3,
    Cancelled = 4
}

public class Order
{
    public int Id { get; set; }
    public required string UserId { get; set; }
    public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;
    public OrderStatus Status { get; set; } = OrderStatus.PendingPayment;

    public int SubtotalCents { get; set; }
    public int TaxCents { get; set; }
    public int ShippingCents { get; set; }
    public int DiscountCents { get; set; }
    public int TotalCents { get; set; }

    public string ShippingName { get; set; } = "";
    public string ShippingAddress1 { get; set; } = "";
    public string ShippingCity { get; set; } = "";
    public string ShippingState { get; set; } = "";
    public string ShippingPostalCode { get; set; } = "";

    public List<OrderItem> Items { get; set; } = new();
    public Payment? Payment { get; set; }
}
