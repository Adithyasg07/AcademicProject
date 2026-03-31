import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaHeart,
  FaUserCircle,
  FaBoxOpen,
  FaCreditCard,
  FaSignOutAlt,
  FaPlus,
  FaMinus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { apiService } from "../api/apiService";
import { useNavigate } from "react-router-dom";
import { products } from "../data/products";
import { featuredProducts } from "../data/bestsellers";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, addToCart, getCartTotal, clearCart } = useCart();
  const { wishlistItems: rawWishlist, removeFromWishlist: contextRemoveFromWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState("dashboard");

  const [orders, setOrders] = useState([]);
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" });

  const wishlist = (rawWishlist || []).map(w => {
    // Find matching product in our merged local/bestseller/db lists
    const item = [...products, ...featuredProducts, ...dbProducts].find(p => 
      p.id === w.ProductId || p.ProductId === w.ProductId || p.id === w.productId
    );
    
    // Senior Fix: Default to backend URL
    const dbPath = w.imageUrl ? `http://localhost:5249${w.imageUrl}` : "/logo.png";
    
    // If it's a known static item (ID <= 60) or the backend image is missing, 
    // we use the local asset to ensure it never flickers or disappears.
    const finalImg = (item && (item.id <= 60 || dbPath.includes("placeholder") || !w.imageUrl)) 
      ? item.img 
      : dbPath;

    return {
      id: w.ProductId,
      name: item ? item.name : w.NAME,
      price: item ? item.price : (w.PRICE ? `₹${w.PRICE}` : ""),
      image: finalImg,
    };
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ordersData = await apiService.get("/Orders");
      
      const comboMapping = {
        "Breakfast Combo Pack": ["Organic Poha", "Organic Daliya", "Organic Oats"],
        "Masalas Combo": ["Organic Turmeric", "Organic Red Chilli", "Organic Coriander", "Organic Garam Masala"],
        "Dry Fruits Combo": ["Organic Walnuts", "Organic Almonds", "Organic Cashews"],
        "Healthy Family Combo": ["Organic Honey", "Desi Cow Ghee", "Jaggery Powder"],
        "Cold Pressed Oils Combo": ["Groundnut Oil", "Sesame Oil", "Coconut Oil", "Mustard Oil"],
        "Everyday Spices Combo": ["Organic Turmeric", "Organic Red Chilli", "Organic Coriander"]
      };

      const expandedOrders = [];
      (ordersData || []).forEach(o => {
        const itemName = o.ItemName || "";
        const orderId = o.Id || o.ID;
        
        if (comboMapping[itemName]) {
          // If it's a combo, create a row for each member
          comboMapping[itemName].forEach(member => {
            expandedOrders.push({
              id: orderId,
              product: member,
              isComboMember: true,
              comboHead: itemName, 
              price: o.ItemPrice,
              quantity: o.Quantity,
              size: o.Size,
              status: o.Status,
              date: o.CreatedAt,
              total: o.OrderTotal
            });
          });
        } else {
          // Regular item
          expandedOrders.push({
            id: orderId,
            product: itemName,
            isComboMember: false,
            price: o.ItemPrice,
            quantity: o.Quantity,
            size: o.Size,
            status: o.Status,
            date: o.CreatedAt,
            total: o.OrderTotal
          });
        }
      });

      setOrders(expandedOrders);

      // Fetch DB Products to ensure mapping works for database items
      try {
        const prodData = await apiService.get("/Products");
        const formatted = (prodData || []).map(p => ({
          id: p.ID,
          name: p.NAME,
          price: `₹${p.PRICE}`,
          img: p.imageUrl ? `http://localhost:5249${p.imageUrl}` : "/logo.png"
        }));
        setDbProducts(formatted);
      } catch (e) {
        console.error("Fetch DB Products error:", e);
      }

      if (user) setProfileForm({ name: user.name, email: user.email, password: "" });

    } catch (error) {
      console.error("User Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await apiService.put("/Auth/profile", profileForm);
      updateUser(res.token, res.user);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditingProfile(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update profile. Email might be taken." });
    }
  };

  const addWishlistToCart = async (item) => {
    // Note: CartContext.addToCart(product, size, quantity)
    const success = await addToCart({ id: item.id, name: item.name }, { label: "Standard", price: item.price }, 1);
    if (success) {
      await removeFromWishlist(item.id);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const orderReq = {
        totalAmount: getCartTotal(),
        paymentMethod: "UPI" // Default for now
      };
      await apiService.post("/Orders", orderReq);
      clearCart(); // Clear local cart state immediately
      setMessage({ type: "success", text: "Order placed successfully!" });
      setActiveTab("orders");
      fetchData(); // Refresh orders list
    } catch (err) {
      setMessage({ type: "error", text: "Failed to place order." });
    }
  };

  const removeFromWishlist = async (productId) => {
    await contextRemoveFromWishlist(productId);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Calculate unique orders for total spend
  const uniqueOrders = Array.from(new Set(orders.map(o => o.id)));
  const totalSpend = orders.reduce((acc, curr) => {
    // Only add the total once per order ID to avoid double-counting expanded items
    if (!acc.ids.has(curr.id)) {
      acc.sum += curr.total;
      acc.ids.add(curr.id);
    }
    return acc;
  }, { sum: 0, ids: new Set() }).sum;

  const tabs = [
    { key: "dashboard", label: "Dashboard", icon: <FaUserCircle size={22} /> },
    { key: "cart", label: "My Cart", icon: <FaShoppingCart size={22} /> },
    { key: "wishlist", label: "Wishlist", icon: <FaHeart size={22} /> },
    { key: "orders", label: "Orders", icon: <FaBoxOpen size={22} /> },
    { key: "payment", label: "Payments", icon: <FaCreditCard size={22} /> },
    { key: "profile", label: "Profile", icon: <FaUserCircle size={22} /> },
  ];

  if (!user) return null; // Wait for ProtectedRoute to kick in if null

  return (
    <div className="min-h-screen bg-green-50 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <div className="md:w-1/4 bg-gradient-to-b from-green-800 to-green-600 p-8 rounded-2xl shadow-xl flex flex-col gap-6 md:sticky md:top-10 h-fit">

          <h2 className="text-white text-2xl font-bold mb-4 text-center">
            My Account
          </h2>

          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                activeTab === tab.key
                  ? "bg-white text-green-700 shadow-md"
                  : "text-white hover:bg-green-500"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-4 mt-auto rounded-xl font-semibold text-lg transition-all text-white hover:bg-red-600"
          >
            <FaSignOutAlt size={22} />
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4 bg-white p-10 rounded-2xl shadow-xl min-h-[650px] relative">

          {/* Success/Error Notifications */}
          {message.text && (
            <div className={`absolute top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-bold z-50 transition-all ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
              {message.text}
            </div>
          )}

          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>
              <p className="text-gray-600 text-lg mb-6">
                Welcome back, <span className="text-green-700 font-bold">{user?.name}</span>!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-green-50 p-8 rounded-2xl shadow-sm border border-green-100 cursor-pointer hover:bg-green-100 transition-all transform hover:-translate-y-1" onClick={() => setActiveTab("orders")}>
                   <div className="flex justify-between items-center mb-4 text-green-700">
                     <h3 className="font-bold text-xl uppercase tracking-wider text-gray-700">Total Orders</h3>
                     <FaBoxOpen size={28} />
                   </div>
                   <p className="text-4xl font-black text-green-700">{orders.length}</p>
                </div>
                <div className="bg-green-50 p-8 rounded-2xl shadow-sm border border-green-100 cursor-pointer hover:bg-green-100 transition-all transform hover:-translate-y-1" onClick={() => setActiveTab("wishlist")}>
                   <div className="flex justify-between items-center mb-4 text-green-700">
                     <h3 className="font-bold text-xl uppercase tracking-wider text-gray-700">Wishlist</h3>
                     <FaHeart size={28} />
                   </div>
                   <p className="text-4xl font-black text-green-700">{wishlist.length}</p>
                </div>
              </div>
            </div>
          )}

          {/* Cart */}
          {activeTab === "cart" && (
            <div>
              <h2 className="text-3xl font-bold mb-6">My Cart</h2>
              {cartItems.length === 0 ? (
                <div className="text-center py-20">
                  <FaShoppingCart size={60} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-xl">Your cart is currently empty.</p>
                  <button onClick={() => navigate("/menu")} className="mt-6 bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition">Shop Now</button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-8">
                    {cartItems.map((item) => (
                      <div key={item.id} className="bg-gray-50 border border-gray-100 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 transition-all hover:shadow-md">
                        <div className="flex-1">
                           <p className="font-bold text-xl text-gray-800">{item.productName}</p>
                           <p className="text-sm text-gray-500 font-medium">Size: {item.size}</p>
                           <p className="text-green-700 font-bold mt-1 text-lg">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-3 text-gray-600 hover:bg-gray-100 transition"><FaMinus size={12} /></button>
                            <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-3 text-gray-600 hover:bg-gray-100 transition"><FaPlus size={12} /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 transition-all p-3 hover:bg-red-50 rounded-full" title="Remove Item"><FaTrash size={20} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div>
                      <p className="text-gray-500 text-lg">Subtotal</p>
                      <h3 className="text-3xl font-black text-green-800 tracking-tight">₹{getCartTotal()}</h3>
                    </div>
                    <button onClick={handlePlaceOrder} className="w-full sm:w-auto bg-green-600 text-white px-12 py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-green-700 transition-all transform hover:scale-105 active:scale-95">PROCEED TO CHECKOUT</button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Wishlist */}
          {activeTab === "wishlist" && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Wishlist</h2>
              {wishlist.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <FaHeart size={60} className="mx-auto mb-4 opacity-50" />
                  <p className="text-xl">Your wishlist is empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((product) => (
                    <div
                      key={product.id}
                      className="group border border-gray-100 p-6 rounded-3xl flex flex-col items-center shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden bg-white"
                    >
                      <button 
                        onClick={() => removeFromWishlist(product.id)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors z-10 p-2 hover:bg-red-50 rounded-full"
                        title="Remove from Wishlist"
                      >
                        <FaTimes size={18} />
                      </button>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 object-contain mb-4 transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <p className="font-bold text-lg text-center text-gray-800 line-clamp-1 mb-2">{product.name}</p>
                      <p className="text-green-700 font-black text-xl mb-4">
                        ₹{product.price}
                      </p>
                      <button 
                        onClick={() => addWishlistToCart(product)}
                        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
                      >
                        <FaShoppingCart /> Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders */}
          {activeTab === "orders" && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Orders</h2>
              {orders.length === 0 ? (
                <p className="text-gray-600 text-lg">You have not placed any orders yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-100 max-h-[500px] overflow-y-auto hide-scrollbar">
                  <table className="w-full border-collapse">
                    <thead className="bg-green-700 text-white uppercase text-xs font-bold tracking-widest sticky top-0 z-10 shadow-sm border-b">
                      <tr>
                        <th className="p-5 text-left bg-green-700">Order ID</th>
                        <th className="p-5 text-left bg-green-700">Product</th>
                        <th className="p-5 text-left bg-green-700">Qty</th>
                        <th className="p-5 text-left bg-green-700">Price</th>
                        <th className="p-5 text-left bg-green-700">Date</th>
                        <th className="p-5 text-left bg-green-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((item, index) => (
                        <tr
                          key={`${item.id}-${index}`}
                          className={`border-b transition ${item.isComboMember ? "bg-green-50/30" : "hover:bg-green-50"}`}
                        >
                          <td className="p-5 font-bold text-gray-400">#{item.id}</td>
                          <td className="p-5">
                            <span className="font-semibold text-gray-800">{item.product}</span>
                            {item.isComboMember && (
                              <span className="block text-[10px] text-green-600 font-bold uppercase tracking-wider">Part of {item.comboHead}</span>
                            )}
                          </td>
                          <td className="p-5 text-gray-600 font-medium">{item.quantity}</td>
                          <td className="p-5 text-green-700 font-bold">₹{item.price}</td>
                          <td className="p-5 text-gray-500 text-sm">
                            {new Date(item.date).toLocaleDateString()}
                          </td>
                          <td
                            className={`p-5 font-bold text-sm ${
                              item.status === "Delivered" || item.status === "Shipped"
                                ? "text-green-700"
                                : "text-yellow-600"
                            }`}
                          >
                            {item.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-6 text-right font-black text-2xl text-green-800">
                    Total Lifetime Spend: ₹{totalSpend}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payments */}
          {activeTab === "payment" && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Transaction History</h2>
              {orders.length === 0 ? (
                <p className="text-gray-500">No payment transactions found.</p>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm max-h-[450px] overflow-y-auto hide-scrollbar">
                  <table className="w-full border-collapse">
                    <thead className="bg-green-700 text-white uppercase text-xs font-bold tracking-widest sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="p-5 text-left bg-green-700 text-white border-green-800">Ref ID</th>
                        <th className="p-5 text-left bg-green-700 text-white border-green-800">Amount</th>
                        <th className="p-5 text-left bg-green-700 text-white border-green-800">Method</th>
                        <th className="p-5 text-left bg-green-700 text-white border-green-800">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-green-50/30 transition-colors">
                          <td className="p-5 font-mono text-gray-500 text-sm">#TXN-{1000 + order.id}</td>
                          <td className="p-5 font-black text-gray-800">₹{order.amount}</td>
                          <td className="p-5"><span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-black uppercase tracking-wider">UPI</span></td>
                          <td className="p-5"><span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-black uppercase tracking-wider">Successful</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Profile */}
          {activeTab === "profile" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Account Profile</h2>
                {!isEditingProfile && (
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-2 text-green-600 hover:text-green-800 font-bold bg-green-50 px-5 py-2 rounded-full transition-all"
                  >
                    <FaEdit /> Edit Profile
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg bg-gray-50 p-8 rounded-3xl border border-gray-100">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-600 uppercase tracking-wider block ml-1">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-600 uppercase tracking-wider block ml-1">Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      readOnly
                      className="w-full p-4 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-600 uppercase tracking-wider block ml-1">New Password (Optional)</label>
                    <input
                      type="password"
                      placeholder="Leave blank to keep current"
                      value={profileForm.password}
                      onChange={(e) => setProfileForm({...profileForm, password: e.target.value})}
                      className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none font-medium"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg hover:shadow-xl">
                      <FaSave /> Save Changes
                    </button>
                    <button type="button" onClick={() => setIsEditingProfile(false)} className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-2xl font-black text-lg hover:bg-gray-300 transition-all">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8 max-w-lg">
                  <div className="flex items-center gap-6 p-6 bg-green-50 rounded-3xl border border-green-100">
                    <div className="bg-green-600 p-6 rounded-full text-white shadow-xl">
                      <FaUserCircle size={60} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-800">{user?.name}</h3>
                      <p className="text-gray-500 font-bold">{user?.role} Account</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 ml-2">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Contact Email</p>
                      <p className="text-lg font-bold text-gray-700">{user?.email}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Default Payment</p>
                      <p className="text-lg font-bold text-gray-700">UPI (Saved)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}