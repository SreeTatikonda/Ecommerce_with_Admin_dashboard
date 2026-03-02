using ECommerce.Web.Models;

namespace ECommerce.Web.Services;

public interface ICartService
{
    Task<Cart> GetOrCreateAsync();
    Task AddAsync(int productId, int quantity);
    Task RemoveAsync(int productId);
    Task UpdateQtyAsync(int productId, int quantity);
    Task ClearAsync();
}
