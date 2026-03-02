using ECommerce.Web.Data;
using ECommerce.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Web.Areas.Admin.Controllers;

[Area("Admin")]
[Authorize(Roles = "Admin")]
public class ProductsController : Controller
{
    private readonly AppDbContext _db;
    public ProductsController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index()
        => View(await _db.Products.Include(p => p.Category).OrderByDescending(p => p.Id).ToListAsync());

    public async Task<IActionResult> Create()
    {
        ViewBag.Categories = await _db.Categories.OrderBy(c => c.Name).ToListAsync();
        return View(new Product { Name = "", Slug = "", PriceCents = 0, Stock = 0, IsActive = true });
    }

    [HttpPost]
    public async Task<IActionResult> Create(Product model)
    {
        ViewBag.Categories = await _db.Categories.OrderBy(c => c.Name).ToListAsync();
        if (!ModelState.IsValid) return View(model);

        _db.Products.Add(model);
        await _db.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    public async Task<IActionResult> Edit(int id)
    {
        var p = await _db.Products.FindAsync(id);
        if (p is null) return NotFound();
        ViewBag.Categories = await _db.Categories.OrderBy(c => c.Name).ToListAsync();
        return View(p);
    }

    [HttpPost]
    public async Task<IActionResult> Edit(Product model)
    {
        ViewBag.Categories = await _db.Categories.OrderBy(c => c.Name).ToListAsync();
        if (!ModelState.IsValid) return View(model);

        _db.Products.Update(model);
        await _db.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    public async Task<IActionResult> Delete(int id)
    {
        var p = await _db.Products.FindAsync(id);
        if (p is null) return RedirectToAction(nameof(Index));
        _db.Products.Remove(p);
        await _db.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }
}
