using ECommerce.Web.Models;
using ECommerce.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Web.Controllers.Api;

[ApiController]
[Route("api/checkout")]
[Authorize]
public class CheckoutApiController : ControllerBase
{
    private readonly IOrderService _orders;
    private readonly UserManager<AppUser> _userMgr;

    public CheckoutApiController(IOrderService orders, UserManager<AppUser> userMgr)
    {
        _orders = orders;
        _userMgr = userMgr;
    }

    public record PlaceOrderRequest(
        string ShippingName,
        string ShippingAddress1,
        string ShippingCity,
        string ShippingState,
        string ShippingPostalCode,
        string? CouponCode);

    [HttpPost("placeorder")]
    public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderRequest req)
    {
        var userId = _userMgr.GetUserId(User)!;
        try
        {
            var order = await _orders.CreateOrderFromCartAsync(userId, new CheckoutRequest(
                req.ShippingName, req.ShippingAddress1, req.ShippingCity,
                req.ShippingState, req.ShippingPostalCode, req.CouponCode));
            return Ok(new { orderId = order.Id });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("pay/{id:int}")]
    public async Task<IActionResult> Pay(int id)
    {
        var (success, message, order) = await _orders.PayAsync(id);
        if (!success) return BadRequest(new { error = message });
        return Ok(new { message, orderId = order!.Id });
    }
}
