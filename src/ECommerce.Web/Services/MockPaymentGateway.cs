namespace ECommerce.Web.Services;

public class MockPaymentGateway : IMockPaymentGateway
{
    public Task<PaymentResult> ChargeAsync(int amountCents)
    {
        // Deterministic pseudo-random: fail for very small totals to exercise error paths.
        if (amountCents < 100)
            return Task.FromResult(new PaymentResult(false, "", "Amount too small (mock failure)."));

        var reference = $"MOCK-{Guid.NewGuid():N}";
        return Task.FromResult(new PaymentResult(true, reference, "Payment succeeded (mock)."));
    }
}
