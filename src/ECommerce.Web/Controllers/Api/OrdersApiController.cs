using ECommerce.Web.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommerce.Web.Models;

namespace ECommerce.Web.Controllers.Api;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersApiController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<AppUser> _userMgr;

    public OrdersApiController(AppDbContext db, UserManager<AppUser> userMgr)
    {
        _db = db;
        _userMgr = userMgr;
    }

    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var userId = _userMgr.GetUserId(User)!;
        var orders = await _db.Orders
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedUtc)
            .Select(o => new
            {
                o.Id, o.CreatedUtc, o.Status,
                o.SubtotalCents, o.TaxCents, o.ShippingCents, o.DiscountCents, o.TotalCents,
                itemCount = o.Items.Count
            })
            .ToListAsync();
        return Ok(orders);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOrder(int id)
    {
        var userId = _userMgr.GetUserId(User)!;
        var order = await _db.Orders
            .Include(o => o.Items)
            .Include(o => o.Payment)
            .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

        if (order is null) return NotFound();

        return Ok(new
        {
            order.Id, order.CreatedUtc, order.Status,
            order.SubtotalCents, order.TaxCents, order.ShippingCents, order.DiscountCents, order.TotalCents,
            order.ShippingName, order.ShippingAddress1, order.ShippingCity, order.ShippingState, order.ShippingPostalCode,
            items = order.Items.Select(i => new { i.ProductName, i.UnitPriceCents, i.Quantity, i.LineTotalCents }),
            payment = order.Payment is null ? null : new { order.Payment.Status, order.Payment.Provider, order.Payment.ProviderReference }
        });
    }
}
