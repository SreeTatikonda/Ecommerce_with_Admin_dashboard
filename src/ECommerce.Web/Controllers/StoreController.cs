using ECommerce.Web.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Web.Controllers;

public class StoreController : Controller
{
    private readonly AppDbContext _db;

    public StoreController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index(string? category)
    {
        var products = _db.Products.Include(p => p.Category).Where(p => p.IsActive);
        if (!string.IsNullOrWhiteSpace(category))
            products = products.Where(p => p.Category!.Slug == category);

        ViewBag.Categories = await _db.Categories.OrderBy(c => c.Name).ToListAsync();
        return View(await products.OrderBy(p => p.Name).ToListAsync());
    }

    public async Task<IActionResult> Product(int id)
    {
        var product = await _db.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
        if (product is null) return NotFound();
        return View(product);
    }
}
