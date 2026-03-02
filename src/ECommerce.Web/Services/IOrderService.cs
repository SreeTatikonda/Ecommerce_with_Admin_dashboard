using ECommerce.Web.Models;

namespace ECommerce.Web.Services;

public record CheckoutRequest(
    string ShippingName,
    string ShippingAddress1,
    string ShippingCity,
    string ShippingState,
    string ShippingPostalCode,
    string? CouponCode
);

public interface IOrderService
{
    Task<Order> CreateOrderFromCartAsync(string userId, CheckoutRequest req);
    Task<(bool Success, string Message, Order? Order)> PayAsync(int orderId);
}
