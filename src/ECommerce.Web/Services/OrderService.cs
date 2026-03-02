using ECommerce.Web.Data;
using ECommerce.Web.Models;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Web.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _db;
    private readonly ICartService _cartService;
    private readonly IMockPaymentGateway _pay;

    public OrderService(AppDbContext db, ICartService cartService, IMockPaymentGateway pay)
    {
        _db = db;
        _cartService = cartService;
        _pay = pay;
    }

    public async Task<Order> CreateOrderFromCartAsync(string userId, CheckoutRequest req)
    {
        var cart = await _cartService.GetOrCreateAsync();
        if (cart.Items.Count == 0) throw new InvalidOperationException("Cart is empty.");

        // Basic subtotal
        var subtotal = cart.Items.Sum(i => i.UnitPriceCents * i.Quantity);

        // MVP tax/shipping placeholders
        var tax = (int)Math.Round(subtotal * 0.07); // 7% placeholder
        var shipping = subtotal >= 5000 ? 0 : 499; // free over $50, else $4.99

        // MVP coupon placeholder
        var discount = string.Equals(req.CouponCode, "SAVE10", StringComparison.OrdinalIgnoreCase)
            ? (int)Math.Round(subtotal * 0.10)
            : 0;

        var total = subtotal + tax + shipping - discount;

        var order = new Order
        {
            UserId = userId,
            SubtotalCents = subtotal,
            TaxCents = tax,
            ShippingCents = shipping,
            DiscountCents = discount,
            TotalCents = total,
            ShippingName = req.ShippingName,
            ShippingAddress1 = req.ShippingAddress1,
            ShippingCity = req.ShippingCity,
            ShippingState = req.ShippingState,
            ShippingPostalCode = req.ShippingPostalCode,
            Status = OrderStatus.PendingPayment
        };

        foreach (var ci in cart.Items)
        {
            order.Items.Add(new OrderItem
            {
                ProductId = ci.ProductId,
                ProductName = ci.Product?.Name ?? "Product",
                UnitPriceCents = ci.UnitPriceCents,
                Quantity = ci.Quantity,
                LineTotalCents = ci.UnitPriceCents * ci.Quantity
            });

            // reduce stock (MVP). For prod add concurrency control.
            var product = await _db.Products.FirstAsync(p => p.Id == ci.ProductId);
            product.Stock = Math.Max(0, product.Stock - ci.Quantity);
        }

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        await _cartService.ClearAsync();
        return order;
    }

    public async Task<(bool Success, string Message, Order? Order)> PayAsync(int orderId)
    {
        var order = await _db.Orders.Include(o => o.Payment).FirstOrDefaultAsync(o => o.Id == orderId);
        if (order is null) return (false, "Order not found.", null);
        if (order.Status != OrderStatus.PendingPayment) return (false, "Order is not pending payment.", order);

        var result = await _pay.ChargeAsync(order.TotalCents);

        var payment = new Payment
        {
            OrderId = order.Id,
            Provider = "MockPay",
            ProviderReference = result.Reference,
            Status = result.Success ? PaymentStatus.Succeeded : PaymentStatus.Failed
        };
        _db.Payments.Add(payment);

        if (result.Success)
        {
            order.Status = OrderStatus.Paid;
        }

        await _db.SaveChangesAsync();
        return (result.Success, result.Message, order);
    }
}
