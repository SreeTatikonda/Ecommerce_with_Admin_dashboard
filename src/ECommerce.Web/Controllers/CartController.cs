using ECommerce.Web.Services;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Web.Controllers;

public class CartController : Controller
{
    private readonly ICartService _cart;

    public CartController(ICartService cart) => _cart = cart;

    public async Task<IActionResult> Index()
    {
        var cart = await _cart.GetOrCreateAsync();
        return View(cart);
    }

    [HttpPost]
    public async Task<IActionResult> Add(int productId, int qty = 1)
    {
        await _cart.AddAsync(productId, qty);
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    public async Task<IActionResult> Remove(int productId)
    {
        await _cart.RemoveAsync(productId);
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    public async Task<IActionResult> UpdateQty(int productId, int qty)
    {
        await _cart.UpdateQtyAsync(productId, qty);
        return RedirectToAction(nameof(Index));
    }
}
