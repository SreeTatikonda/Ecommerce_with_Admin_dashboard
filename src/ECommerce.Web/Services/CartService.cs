using ECommerce.Web.Data;
using ECommerce.Web.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ECommerce.Web.Services;

public class CartService : ICartService
{
    private const string CartCookie = "ecom_cart";
    private readonly AppDbContext _db;
    private readonly IHttpContextAccessor _http;

    public CartService(AppDbContext db, IHttpContextAccessor http)
    {
        _db = db;
        _http = http;
    }

    private string GetCartKey()
    {
        var ctx = _http.HttpContext!;
        // If authenticated, use user id
        var userId = ctx.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!string.IsNullOrWhiteSpace(userId)) return $"user:{userId}";

        // else cookie-based key
        if (ctx.Request.Cookies.TryGetValue(CartCookie, out var key) && !string.IsNullOrWhiteSpace(key))
            return $"anon:{key}";

        var newKey = Guid.NewGuid().ToString("N");
        ctx.Response.Cookies.Append(CartCookie, newKey, new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.Lax,
            IsEssential = true,
            Expires = DateTimeOffset.UtcNow.AddDays(30)
        });
        return $"anon:{newKey}";
    }

    public async Task<Cart> GetOrCreateAsync()
    {
        var key = GetCartKey();
        var cart = await _db.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.CartKey == key);

        if (cart is not null) return cart;

        cart = new Cart { CartKey = key };
        _db.Carts.Add(cart);
        await _db.SaveChangesAsync();
        return cart;
    }

    public async Task AddAsync(int productId, int quantity)
    {
        if (quantity <= 0) quantity = 1;
        var cart = await GetOrCreateAsync();
        var product = await _db.Products.FirstAsync(p => p.Id == productId && p.IsActive);

        var existing = cart.Items.FirstOrDefault(i => i.ProductId == productId);
        if (existing is null)
        {
            cart.Items.Add(new CartItem
            {
                ProductId = productId,
                Quantity = quantity,
                UnitPriceCents = product.PriceCents
            });
        }
        else
        {
            existing.Quantity += quantity;
        }

        cart.UpdatedUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync();
    }

    public async Task RemoveAsync(int productId)
    {
        var cart = await GetOrCreateAsync();
        var item = cart.Items.FirstOrDefault(i => i.ProductId == productId);
        if (item is null) return;

        _db.CartItems.Remove(item);
        cart.UpdatedUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync();
    }

    public async Task UpdateQtyAsync(int productId, int quantity)
    {
        var cart = await GetOrCreateAsync();
        var item = cart.Items.FirstOrDefault(i => i.ProductId == productId);
        if (item is null) return;

        if (quantity <= 0)
        {
            _db.CartItems.Remove(item);
        }
        else
        {
            item.Quantity = quantity;
        }
        cart.UpdatedUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync();
    }

    public async Task ClearAsync()
    {
        var cart = await GetOrCreateAsync();
        _db.CartItems.RemoveRange(cart.Items);
        cart.UpdatedUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync();
    }
}
