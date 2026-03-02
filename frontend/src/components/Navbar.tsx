import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCart, logout } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart, User, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { user, refresh } = useAuth();
  const navigate = useNavigate();
  const { data: cart } = useQuery({ queryKey: ["cart"], queryFn: getCart, refetchInterval: 0 });

  const handleLogout = async () => {
    await logout();
    refresh();
    navigate("/");
  };

  return (
    <header className="bg-walmart-blue text-white sticky top-0 z-50 shadow-md">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="text-walmart-yellow font-extrabold text-2xl tracking-tight flex-shrink-0">
          🛒 ShopMart
        </Link>

        {/* Search bar (UI only) */}
        <div className="flex-1 max-w-2xl">
          <div className="flex rounded-full overflow-hidden border-2 border-walmart-yellow">
            <input
              type="text"
              placeholder="Search everything at ShopMart..."
              className="flex-1 px-4 py-2 text-gray-800 text-sm outline-none"
            />
            <button className="bg-walmart-yellow px-5 text-walmart-blue font-bold text-sm">
              Search
            </button>
          </div>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-5 flex-shrink-0">
          {user?.isAuthenticated ? (
            <>
              <span className="text-sm hidden md:block">Hi, {user.email?.split("@")[0]}</span>
              {user.isAdmin && (
                <Link to="/admin" className="flex flex-col items-center text-xs hover:text-walmart-yellow">
                  <LayoutDashboard size={20} />
                  <span>Admin</span>
                </Link>
              )}
              <Link to="/orders" className="flex flex-col items-center text-xs hover:text-walmart-yellow">
                <User size={20} />
                <span>Orders</span>
              </Link>
              <button onClick={handleLogout} className="flex flex-col items-center text-xs hover:text-walmart-yellow">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex flex-col items-center text-xs hover:text-walmart-yellow">
                <User size={20} />
                <span>Sign In</span>
              </Link>
            </>
          )}
          <Link to="/cart" className="flex flex-col items-center text-xs hover:text-walmart-yellow relative">
            <ShoppingCart size={20} />
            {cart && cart.itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-walmart-yellow text-walmart-blue text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cart.itemCount}
              </span>
            )}
            <span>Cart</span>
          </Link>
        </div>
      </div>

      {/* Category nav strip */}
      <nav className="bg-walmart-dark px-4 py-1 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex gap-6 text-sm whitespace-nowrap">
          <Link to="/" className="hover:text-walmart-yellow py-1">All Departments</Link>
          {["electronics","gadgets","home-decor","clothing","sports-outdoors","kitchen","beauty","books"].map(slug => (
            <Link key={slug} to={`/category/${slug}`} className="hover:text-walmart-yellow py-1 capitalize">
              {slug.replace(/-/g, " ")}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
