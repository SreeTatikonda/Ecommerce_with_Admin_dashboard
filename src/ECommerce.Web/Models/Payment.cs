namespace ECommerce.Web.Models;

public enum PaymentStatus
{
    Initiated = 0,
    Succeeded = 1,
    Failed = 2
}

public class Payment
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order? Order { get; set; }

    public PaymentStatus Status { get; set; } = PaymentStatus.Initiated;
    public string Provider { get; set; } = "MockPay";
    public string ProviderReference { get; set; } = "";
    public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;
}
