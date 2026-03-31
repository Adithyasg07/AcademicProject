import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import Navbar from "./Navbar";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { apiService } from "../api/apiService";
import { products as localProducts } from "../data/products";

export default function Menu() {
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { search } = useLocation();
  const navigate = useNavigate();
  const category = new URLSearchParams(search).get("category");
  const generateRating = (id) => {
    const ratings = [3.5, 3.8, 4.1, 4.3, 4.5, 4.6, 4.8, 5.0];
    return ratings[id % ratings.length];
  };

const [dbProducts, setDbProducts] = React.useState([]);

  React.useEffect(() => {
    const fetchDbProducts = async () => {
      try {
        const response = await apiService.get("/Products");
        const data = Array.isArray(response) ? response : [];
        const formatted = data.map(p => {
          const numericPrice = Number(p.PRICE || 0);
          return {
            id: p.ID || Math.random(),
            name: p.NAME,
            price: `₹${numericPrice}`,
            category: p.CATEGORY,
            img: p.imageUrl ? `http://localhost:5249${p.imageUrl}` : "https://via.placeholder.com/150",
            sizes: [
              { label: "Standard", price: numericPrice }
            ],
            rating: generateRating(p.ID || Math.floor(Math.random() * 10))
          };
        });
        setDbProducts(formatted);
      } catch (err) {
        console.error("Failed to fetch products from backend:", err);
      }
    };

    fetchDbProducts();
  }, []);

  // Smart Merge: Deduplicate by name, prioritizing database records for valid transaction IDs
  const allProducts = React.useMemo(() => {
    const merged = new Map();
    
    // Add local products first as baseline
    localProducts.forEach(p => merged.set(p.name.toLowerCase(), p));
    
    // Override with database products, but preserve local quality assets
    dbProducts.forEach(p => {
      const key = p.name.toLowerCase();
      const local = merged.get(key);
      
      // Senior Fix: If it's a known static product (ID 1-54) or the DB image is a placeholder,
      // Always prefer the high-quality local image asset.
      if (local && (p.id <= 60 || p.img.includes("placeholder") || !p.img)) {
        merged.set(key, { ...p, img: local.img });
      } else {
        merged.set(key, p);
      }
    });
    
    const finalProducts = Array.from(merged.values());
    
    return category
      ? finalProducts.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase())
      : finalProducts;
  }, [dbProducts, category]);

  const handleQuickAdd = (e, item) => {
    e.stopPropagation();
    const defaultSize = item.sizes && item.sizes.length > 0 ? item.sizes[0] : { label: "Standard", price: parseInt(item.price?.toString().replace(/[^\d]/g, '')) || 0 };
    addToCart(item, defaultSize, 1);
  };

  const handleWishlist = async (e, item) => {
    e.stopPropagation();
    if (isInWishlist(item.id)) {
      await removeFromWishlist(item.id);
    } else {
      await addToWishlist(item.id);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-green-800 mb-8 border-b pb-4">
          {category || "Our Products"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {allProducts.map(item => (
          <div
            key={item.id}
            onClick={() =>
              navigate("/ProductInformation", { state: { product: item } })
            }
            className="bg-white rounded-2xl shadow hover:shadow-xl cursor-pointer relative overflow-hidden"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-48 object-contain p-4 bg-gray-50"
            />
            <button 
              onClick={(e) => handleWishlist(e, item)}
              className={`absolute top-4 right-4 backdrop-blur-sm p-3 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95 ${isInWishlist(item.id) ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-400 hover:text-red-500'}`}
              title={isInWishlist(item.id) ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <FaHeart size={18} />
            </button>
           
            <div className="p-5">
              <h3 className="font-semibold text-lg text-gray-800 mb-1">{item.name}</h3>
              <div className="flex items-center justify-between mt-3">
                <p className="font-bold text-green-700 text-xl">{item.price}</p>
                <button
                  onClick={(e) => handleQuickAdd(e, item)}
                  className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-md transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center"
                  title="Quick Add to Cart"
                >
                  <FaShoppingCart size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}