using ECommerce.Web.Data;
using ECommerce.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Web.Controllers.Api;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminApiController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminApiController(AppDbContext db) => _db = db;

    // Dashboard
    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard()
    {
        var productCount = await _db.Products.CountAsync();
        var orderCount = await _db.Orders.CountAsync();
        var revenueCents = await _db.Orders
            .Where(o => o.Status != OrderStatus.Cancelled)
            .SumAsync(o => (int?)o.TotalCents) ?? 0;
        var recentOrders = await _db.Orders
            .OrderByDescending(o => o.CreatedUtc)
            .Take(5)
            .Select(o => new { o.Id, o.CreatedUtc, o.Status, o.TotalCents })
            .ToListAsync();
        return Ok(new { productCount, orderCount, revenueCents, recentOrders });
    }

    // Products CRUD
    [HttpGet("products")]
    public async Task<IActionResult> GetProducts() =>
        Ok(await _db.Products.Include(p => p.Category)
            .OrderByDescending(p => p.Id)
            .Select(p => new { p.Id, p.Name, p.Slug, p.Description, p.PriceCents, p.Stock, p.IsActive, Category = new { p.Category!.Id, p.Category.Name } })
            .ToListAsync());

    public record ProductRequest(string Name, string Slug, string? Description, int PriceCents, int Stock, bool IsActive, int CategoryId);

    [HttpPost("products")]
    public async Task<IActionResult> CreateProduct([FromBody] ProductRequest req)
    {
        var p = new Product { Name = req.Name, Slug = req.Slug, Description = req.Description, PriceCents = req.PriceCents, Stock = req.Stock, IsActive = req.IsActive, CategoryId = req.CategoryId };
        _db.Products.Add(p);
        await _db.SaveChangesAsync();
        return Ok(new { p.Id });
    }

    [HttpPut("products/{id:int}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductRequest req)
    {
        var p = await _db.Products.FindAsync(id);
        if (p is null) return NotFound();
        p.Name = req.Name; p.Slug = req.Slug; p.Description = req.Description;
        p.PriceCents = req.PriceCents; p.Stock = req.Stock; p.IsActive = req.IsActive; p.CategoryId = req.CategoryId;
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("products/{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var p = await _db.Products.FindAsync(id);
        if (p is null) return NotFound();
        _db.Products.Remove(p);
        await _db.SaveChangesAsync();
        return Ok();
    }

    // Categories CRUD
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories() =>
        Ok(await _db.Categories.OrderBy(c => c.Name).Select(c => new { c.Id, c.Name, c.Slug }).ToListAsync());

    public record CategoryRequest(string Name, string Slug);

    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory([FromBody] CategoryRequest req)
    {
        var c = new Category { Name = req.Name, Slug = req.Slug };
        _db.Categories.Add(c);
        await _db.SaveChangesAsync();
        return Ok(new { c.Id });
    }

    [HttpPut("categories/{id:int}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryRequest req)
    {
        var c = await _db.Categories.FindAsync(id);
        if (c is null) return NotFound();
        c.Name = req.Name; c.Slug = req.Slug;
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("categories/{id:int}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var c = await _db.Categories.FindAsync(id);
        if (c is null) return NotFound();
        _db.Categories.Remove(c);
        await _db.SaveChangesAsync();
        return Ok();
    }

    // Orders
    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders() =>
        Ok(await _db.Orders.OrderByDescending(o => o.CreatedUtc)
            .Select(o => new { o.Id, o.CreatedUtc, o.Status, o.TotalCents, o.UserId })
            .ToListAsync());

    [HttpGet("orders/{id:int}")]
    public async Task<IActionResult> GetOrder(int id)
    {
        var o = await _db.Orders.Include(o => o.Items).Include(o => o.Payment).FirstOrDefaultAsync(o => o.Id == id);
        if (o is null) return NotFound();
        return Ok(new
        {
            o.Id, o.CreatedUtc, o.Status, o.UserId,
            o.SubtotalCents, o.TaxCents, o.ShippingCents, o.DiscountCents, o.TotalCents,
            o.ShippingName, o.ShippingAddress1, o.ShippingCity, o.ShippingState, o.ShippingPostalCode,
            items = o.Items.Select(i => new { i.ProductName, i.UnitPriceCents, i.Quantity, i.LineTotalCents }),
            payment = o.Payment is null ? null : new { o.Payment.Status, o.Payment.Provider, o.Payment.ProviderReference }
        });
    }

    public record UpdateStatusRequest(OrderStatus Status);

    [HttpPost("orders/{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusRequest req)
    {
        var o = await _db.Orders.FindAsync(id);
        if (o is null) return NotFound();
        o.Status = req.Status;
        await _db.SaveChangesAsync();
        return Ok();
    }
}
