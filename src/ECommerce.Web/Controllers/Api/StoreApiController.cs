using ECommerce.Web.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Web.Controllers.Api;

[ApiController]
[Route("api")]
public class StoreApiController : ControllerBase
{
    private readonly AppDbContext _db;
    public StoreApiController(AppDbContext db) => _db = db;

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var cats = await _db.Categories
            .OrderBy(c => c.Name)
            .Select(c => new { c.Id, c.Name, c.Slug })
            .ToListAsync();
        return Ok(cats);
    }

    [HttpGet("products")]
    public async Task<IActionResult> GetProducts([FromQuery] string? category)
    {
        var q = _db.Products
            .Include(p => p.Category)
            .Where(p => p.IsActive);

        if (!string.IsNullOrEmpty(category))
            q = q.Where(p => p.Category!.Slug == category);

        var products = await q
            .OrderBy(p => p.Name)
            .Select(p => new
            {
                p.Id, p.Name, p.Slug, p.Description,
                p.PriceCents, p.Stock,
                Category = new { p.Category!.Id, p.Category.Name, p.Category.Slug }
            })
            .ToListAsync();

        return Ok(products);
    }

    [HttpGet("products/{id:int}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var p = await _db.Products
            .Include(p => p.Category)
            .Where(p => p.Id == id && p.IsActive)
            .Select(p => new
            {
                p.Id, p.Name, p.Slug, p.Description,
                p.PriceCents, p.Stock,
                Category = new { p.Category!.Id, p.Category.Name, p.Category.Slug }
            })
            .FirstOrDefaultAsync();

        if (p is null) return NotFound();
        return Ok(p);
    }
}
