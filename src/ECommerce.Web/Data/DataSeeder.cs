using ECommerce.Web.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Web.Data;

public class DataSeeder
{
    private readonly IServiceProvider _sp;

    public DataSeeder(IServiceProvider sp) => _sp = sp;

    public async Task SeedAsync()
    {
        using var scope = _sp.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userMgr = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        var roleMgr = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        // Roles
        if (!await roleMgr.Roles.AnyAsync(r => r.Name == "Admin"))
            await roleMgr.CreateAsync(new IdentityRole("Admin"));

        // Users
        async Task EnsureUser(string email, string pwd, bool isAdmin)
        {
            var u = await userMgr.FindByEmailAsync(email);
            if (u is null)
            {
                u = new AppUser { UserName = email, Email = email, EmailConfirmed = true };
                await userMgr.CreateAsync(u, pwd);
            }
            if (isAdmin && !await userMgr.IsInRoleAsync(u, "Admin"))
                await userMgr.AddToRoleAsync(u, "Admin");
        }

        await EnsureUser("admin@example.com", "Admin123!", true);
        await EnsureUser("user@example.com", "User123!", false);

        // Catalog seed
        if (!await db.Categories.AnyAsync())
        {
            var electronics  = new Category { Name = "Electronics",       Slug = "electronics" };
            var gadgets      = new Category { Name = "Gadgets",           Slug = "gadgets" };
            var homeDecor    = new Category { Name = "Home Decor",        Slug = "home-decor" };
            var clothing     = new Category { Name = "Clothing",          Slug = "clothing" };
            var sports       = new Category { Name = "Sports & Outdoors", Slug = "sports-outdoors" };
            var kitchen      = new Category { Name = "Kitchen",           Slug = "kitchen" };
            var beauty       = new Category { Name = "Beauty",            Slug = "beauty" };
            var books        = new Category { Name = "Books",             Slug = "books" };

            db.Categories.AddRange(electronics, gadgets, homeDecor, clothing, sports, kitchen, beauty, books);
            await db.SaveChangesAsync();

            db.Products.AddRange(
                // Electronics
                new Product { Name = "65\" 4K Smart TV", Slug = "65-4k-smart-tv", Description = "Crystal-clear 4K display with built-in streaming apps.", PriceCents = 54999, Stock = 20, IsActive = true, CategoryId = electronics.Id },
                new Product { Name = "Wireless Noise-Cancelling Headphones", Slug = "wireless-headphones", Description = "Premium over-ear headphones with 30-hour battery.", PriceCents = 7999, Stock = 45, IsActive = true, CategoryId = electronics.Id },
                new Product { Name = "Mechanical Keyboard", Slug = "mechanical-keyboard", Description = "Tactile switches, RGB backlit, compact TKL layout.", PriceCents = 9999, Stock = 30, IsActive = true, CategoryId = electronics.Id },
                new Product { Name = "Laptop Stand", Slug = "laptop-stand", Description = "Adjustable aluminum stand for 11–17\" laptops.", PriceCents = 3499, Stock = 60, IsActive = true, CategoryId = electronics.Id },

                // Gadgets
                new Product { Name = "Smart Watch Pro", Slug = "smart-watch-pro", Description = "Fitness tracking, GPS, heart rate, 5-day battery.", PriceCents = 19999, Stock = 35, IsActive = true, CategoryId = gadgets.Id },
                new Product { Name = "Portable Bluetooth Speaker", Slug = "bluetooth-speaker", Description = "360° surround sound, waterproof, 12-hour playtime.", PriceCents = 4999, Stock = 50, IsActive = true, CategoryId = gadgets.Id },
                new Product { Name = "Wireless Charging Pad", Slug = "wireless-charging-pad", Description = "Fast 15W Qi charging for all compatible devices.", PriceCents = 2499, Stock = 80, IsActive = true, CategoryId = gadgets.Id },
                new Product { Name = "Mini Drone with Camera", Slug = "mini-drone-camera", Description = "1080p HD camera, 20-min flight time, foldable design.", PriceCents = 8999, Stock = 18, IsActive = true, CategoryId = gadgets.Id },

                // Home Decor
                new Product { Name = "Scented Soy Candle Set", Slug = "scented-candle-set", Description = "Set of 3 hand-poured soy candles — lavender, vanilla, cedar.", PriceCents = 2999, Stock = 70, IsActive = true, CategoryId = homeDecor.Id },
                new Product { Name = "Boho Macramé Wall Hanging", Slug = "macrame-wall-hanging", Description = "Handcrafted cotton macramé, 24\" × 36\".", PriceCents = 3499, Stock = 40, IsActive = true, CategoryId = homeDecor.Id },
                new Product { Name = "Ceramic Vase Set", Slug = "ceramic-vase-set", Description = "Set of 3 minimalist matte ceramic vases.", PriceCents = 4499, Stock = 55, IsActive = true, CategoryId = homeDecor.Id },
                new Product { Name = "LED Fairy Light Curtain", Slug = "fairy-light-curtain", Description = "300 warm-white LEDs, 9.8 ft × 9.8 ft curtain.", PriceCents = 1999, Stock = 90, IsActive = true, CategoryId = homeDecor.Id },

                // Clothing
                new Product { Name = "Classic Denim Jacket", Slug = "denim-jacket", Description = "Stonewashed denim, relaxed fit, sizes S–XXL.", PriceCents = 5999, Stock = 40, IsActive = true, CategoryId = clothing.Id },
                new Product { Name = "Women's Floral Sundress", Slug = "floral-sundress", Description = "Lightweight chiffon, adjustable straps, sizes XS–XL.", PriceCents = 3499, Stock = 55, IsActive = true, CategoryId = clothing.Id },
                new Product { Name = "Men's Slim Chinos", Slug = "slim-chinos", Description = "Stretch cotton blend, slim fit, multiple colors.", PriceCents = 4499, Stock = 65, IsActive = true, CategoryId = clothing.Id },
                new Product { Name = "Unisex Hoodie", Slug = "unisex-hoodie", Description = "Premium fleece, kangaroo pocket, sizes XS–3XL.", PriceCents = 3999, Stock = 80, IsActive = true, CategoryId = clothing.Id },

                // Sports & Outdoors
                new Product { Name = "Yoga Mat", Slug = "yoga-mat", Description = "Non-slip TPE mat, 6mm thick, includes carry strap.", PriceCents = 2999, Stock = 75, IsActive = true, CategoryId = sports.Id },
                new Product { Name = "Adjustable Dumbbell Set", Slug = "adjustable-dumbbell-set", Description = "5–52.5 lb per dumbbell, replaces 15 sets.", PriceCents = 29999, Stock = 15, IsActive = true, CategoryId = sports.Id },
                new Product { Name = "Hydration Backpack", Slug = "hydration-backpack", Description = "2L water bladder, 15L storage, reflective strips.", PriceCents = 5499, Stock = 30, IsActive = true, CategoryId = sports.Id },
                new Product { Name = "Jump Rope", Slug = "jump-rope", Description = "Speed rope with ball bearings, adjustable length.", PriceCents = 1499, Stock = 100, IsActive = true, CategoryId = sports.Id },

                // Kitchen
                new Product { Name = "Air Fryer 5.8 Qt", Slug = "air-fryer-5qt", Description = "Digital display, 8 presets, dishwasher-safe basket.", PriceCents = 8999, Stock = 25, IsActive = true, CategoryId = kitchen.Id },
                new Product { Name = "Stainless Steel Knife Set", Slug = "knife-set", Description = "6-piece German steel set with wooden block.", PriceCents = 6999, Stock = 35, IsActive = true, CategoryId = kitchen.Id },
                new Product { Name = "Instant Pot Duo 7-in-1", Slug = "instant-pot-duo", Description = "Pressure cooker, slow cooker, rice cooker, steamer & more.", PriceCents = 9999, Stock = 20, IsActive = true, CategoryId = kitchen.Id },
                new Product { Name = "Reusable Silicone Food Bags", Slug = "silicone-food-bags", Description = "Set of 4 leak-proof bags, freezer & dishwasher safe.", PriceCents = 1999, Stock = 120, IsActive = true, CategoryId = kitchen.Id },

                // Beauty
                new Product { Name = "Vitamin C Serum", Slug = "vitamin-c-serum", Description = "20% Vitamin C + hyaluronic acid, brightening formula.", PriceCents = 2499, Stock = 90, IsActive = true, CategoryId = beauty.Id },
                new Product { Name = "Rose Gold Makeup Brush Set", Slug = "makeup-brush-set", Description = "16-piece set with synthetic bristles and roll-up bag.", PriceCents = 3499, Stock = 60, IsActive = true, CategoryId = beauty.Id },
                new Product { Name = "Jade Facial Roller", Slug = "jade-facial-roller", Description = "100% natural jade stone, dual-sided roller.", PriceCents = 1999, Stock = 75, IsActive = true, CategoryId = beauty.Id },

                // Books
                new Product { Name = "Atomic Habits", Slug = "atomic-habits", Description = "James Clear — the #1 guide to building good habits.", PriceCents = 1699, Stock = 100, IsActive = true, CategoryId = books.Id },
                new Product { Name = "Clean Architecture", Slug = "clean-architecture-book", Description = "Robert C. Martin — practical software design principles.", PriceCents = 3499, Stock = 50, IsActive = true, CategoryId = books.Id },
                new Product { Name = "The Pragmatic Programmer", Slug = "pragmatic-programmer", Description = "Hunt & Thomas — timeless advice for software craftspeople.", PriceCents = 2999, Stock = 45, IsActive = true, CategoryId = books.Id }
            );
            await db.SaveChangesAsync();
        }
    }
}
