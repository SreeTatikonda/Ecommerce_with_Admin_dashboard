using ECommerce.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerce.Web.Controllers;

[Authorize]
public class CheckoutController : Controller
{
    private readonly ICartService _cart;
    private readonly IOrderService _orders;

    public CheckoutController(ICartService cart, IOrderService orders)
    {
        _cart = cart;
        _orders = orders;
    }

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var cart = await _cart.GetOrCreateAsync();
        if (cart.Items.Count == 0)
            return RedirectToAction("Index", "Cart");

        return View(new CheckoutRequest("", "", "", "", "", null));
    }

    [HttpPost]
    public async Task<IActionResult> PlaceOrder(CheckoutRequest req)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var order = await _orders.CreateOrderFromCartAsync(userId, req);
        return RedirectToAction(nameof(Pay), new { id = order.Id });
    }

    [HttpGet]
    public IActionResult Pay(int id) => View(model: id);

    [HttpPost]
    public async Task<IActionResult> PayNow(int id)
    {
        var (ok, message, order) = await _orders.PayAsync(id);
        TempData["PayMessage"] = message;
        if (!ok) return RedirectToAction(nameof(Pay), new { id });

        return RedirectToAction("Details", "Orders", new { id });
    }
}
