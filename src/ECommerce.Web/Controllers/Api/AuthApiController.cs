using ECommerce.Web.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Web.Controllers.Api;

[ApiController]
[Route("api/auth")]
public class AuthApiController : ControllerBase
{
    private readonly UserManager<AppUser> _userMgr;
    private readonly SignInManager<AppUser> _signInMgr;

    public AuthApiController(UserManager<AppUser> userMgr, SignInManager<AppUser> signInMgr)
    {
        _userMgr = userMgr;
        _signInMgr = signInMgr;
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        if (!User.Identity?.IsAuthenticated ?? true)
            return Ok(new { isAuthenticated = false });

        var user = await _userMgr.GetUserAsync(User);
        var roles = user is not null ? await _userMgr.GetRolesAsync(user) : [];
        return Ok(new
        {
            isAuthenticated = true,
            email = user?.Email,
            isAdmin = roles.Contains("Admin")
        });
    }

    public record LoginRequest(string Email, string Password);

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var result = await _signInMgr.PasswordSignInAsync(req.Email, req.Password, isPersistent: true, lockoutOnFailure: false);
        if (!result.Succeeded)
            return BadRequest(new { error = "Invalid email or password." });

        var user = await _userMgr.FindByEmailAsync(req.Email);
        var roles = user is not null ? await _userMgr.GetRolesAsync(user) : [];
        return Ok(new { email = user?.Email, isAdmin = roles.Contains("Admin") });
    }

    public record RegisterRequest(string Email, string Password);

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        var user = new AppUser { UserName = req.Email, Email = req.Email, EmailConfirmed = true };
        var result = await _userMgr.CreateAsync(user, req.Password);
        if (!result.Succeeded)
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

        await _signInMgr.SignInAsync(user, isPersistent: true);
        return Ok(new { email = user.Email, isAdmin = false });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInMgr.SignOutAsync();
        return Ok();
    }
}
