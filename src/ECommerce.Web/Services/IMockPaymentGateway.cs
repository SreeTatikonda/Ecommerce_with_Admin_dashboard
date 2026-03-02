namespace ECommerce.Web.Services;

public record PaymentResult(bool Success, string Reference, string Message);

public interface IMockPaymentGateway
{
    Task<PaymentResult> ChargeAsync(int amountCents);
}
