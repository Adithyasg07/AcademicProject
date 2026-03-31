import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header className="bg-white shadow-md px-6 py-3 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-3">
            <img src="/logo.png" alt="Organic Tattva Logo" className="h-12" />
            <span className="text-lg font-bold text-green-800 hidden sm:block">organic tattva</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-700">
            <Link to="/home" className="hover:text-green-700 transition">Home</Link>
            <Link to="/menu" className="hover:text-green-700 transition">Shop</Link>
            <Link to="/aboutus" className="hover:text-green-700 transition">About</Link>
            <Link to="/contact" className="hover:text-green-700 transition">Contact</Link>
          </nav>

          {/* Right - Icons + Auth */}
          <div className="flex items-center space-x-4 text-gray-700">
            
            {/* Wishlist Link with badge */}
            <Link
              to="/userdashboard"
              className="relative p-2 hover:text-red-600 transition"
              aria-label="Wishlist"
              onClick={() => {
                // Navigate to dashboard and maybe auto-switch tab if we had that logic
              }}
            >
              <FaHeart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Icon with badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:text-green-700 transition"
              aria-label="Open Cart"
            >
              <FaShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth: Role-Based Display */}
            {user ? (
              <div className="flex items-center space-x-3">
                {user.role === "Admin" ? (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-800"
                  >
                    <FaUserCircle size={20} />
                    <span className="hidden sm:block">Admin Panel</span>
                  </Link>
                ) : (
                  <Link
                    to="/userdashboard"
                    className="flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-900"
                  >
                    <FaUserCircle size={20} />
                    <span className="hidden sm:block">{user.name}</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-xs bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition">
                  Login
                </button>
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden flex flex-col gap-3 text-sm font-medium text-gray-700 pb-3 border-t pt-3">
            <Link to="/home" onClick={() => setIsMenuOpen(false)} className="hover:text-green-700">Home</Link>
            <Link to="/menu" onClick={() => setIsMenuOpen(false)} className="hover:text-green-700">Shop</Link>
            <Link to="/aboutus" onClick={() => setIsMenuOpen(false)} className="hover:text-green-700">About</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="hover:text-green-700">Contact</Link>
            {user ? (
              <>
                <Link to="/userdashboard" onClick={() => setIsMenuOpen(false)} className="hover:text-green-700">My Account</Link>
                <button onClick={handleLogout} className="text-left text-red-500">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <button className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md">Login</button>
              </Link>
            )}
            <button onClick={() => { setIsCartOpen(true); setIsMenuOpen(false); }} className="text-left hover:text-green-700">
              🛒 Cart ({cartCount})
            </button>
          </nav>
        )}
      </header>

      {/* Cart Drawer - globally available */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
