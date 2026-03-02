using ECommerce.Web.Services;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Web.Controllers.Api;

[ApiController]
[Route("api/cart")]
public class CartApiController : ControllerBase
{
    private readonly ICartService _cart;
    public CartApiController(ICartService cart) => _cart = cart;

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var cart = await _cart.GetOrCreateAsync();
        return Ok(new
        {
            items = cart.Items.Select(i => new
            {
                i.ProductId,
                i.Product?.Name,
                i.UnitPriceCents,
                i.Quantity,
                LineTotalCents = i.UnitPriceCents * i.Quantity
            }),
            totalCents = cart.Items.Sum(i => i.UnitPriceCents * i.Quantity),
            itemCount = cart.Items.Sum(i => i.Quantity)
        });
    }

    public record AddRequest(int ProductId, int Qty = 1);

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] AddRequest req)
    {
        await _cart.AddAsync(req.ProductId, req.Qty);
        return Ok();
    }

    public record RemoveRequest(int ProductId);

    [HttpPost("remove")]
    public async Task<IActionResult> Remove([FromBody] RemoveRequest req)
    {
        await _cart.RemoveAsync(req.ProductId);
        return Ok();
    }

    public record UpdateQtyRequest(int ProductId, int Qty);

    [HttpPost("updateqty")]
    public async Task<IActionResult> UpdateQty([FromBody] UpdateQtyRequest req)
    {
        await _cart.UpdateQtyAsync(req.ProductId, req.Qty);
        return Ok();
    }
}
