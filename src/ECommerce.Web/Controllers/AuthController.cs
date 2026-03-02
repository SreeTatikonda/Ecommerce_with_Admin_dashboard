using ECommerce.Web.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Web.Controllers;

public class AuthController : Controller
{
    private readonly UserManager<AppUser> _users;
    private readonly SignInManager<AppUser> _signIn;

    public AuthController(UserManager<AppUser> users, SignInManager<AppUser> signIn)
    {
        _users = users;
        _signIn = signIn;
    }

    [HttpGet("/auth/login")]
    public IActionResult Login(string? returnUrl = null) => View(model: returnUrl);

    [HttpPost("/auth/login")]
    public async Task<IActionResult> LoginPost(string email, string password, string? returnUrl = null)
    {
        var result = await _signIn.PasswordSignInAsync(email, password, isPersistent: true, lockoutOnFailure: false);
        if (!result.Succeeded)
        {
            TempData["AuthError"] = "Invalid login.";
            return RedirectToAction(nameof(Login), new { returnUrl });
        }

        if (!string.IsNullOrWhiteSpace(returnUrl) && Url.IsLocalUrl(returnUrl))
            return Redirect(returnUrl);

        return RedirectToAction("Index", "Store");
    }

    [HttpGet("/auth/register")]
    public IActionResult Register() => View();

    [HttpPost("/auth/register")]
    public async Task<IActionResult> RegisterPost(string email, string password)
    {
        var user = new AppUser { UserName = email, Email = email, EmailConfirmed = true };
        var res = await _users.CreateAsync(user, password);
        if (!res.Succeeded)
        {
            TempData["AuthError"] = string.Join(" ", res.Errors.Select(e => e.Description));
            return RedirectToAction(nameof(Register));
        }
        await _signIn.SignInAsync(user, isPersistent: true);
        return RedirectToAction("Index", "Store");
    }

    [HttpPost("/auth/logout")]
    public async Task<IActionResult> Logout()
    {
        await _signIn.SignOutAsync();
        return RedirectToAction("Index", "Store");
    }

    [HttpGet("/auth/denied")]
    public IActionResult Denied() => View();
}
