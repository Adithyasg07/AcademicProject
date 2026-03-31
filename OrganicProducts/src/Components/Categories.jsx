import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Combos & Deals", icon: "🛍️" },
  { name: "Flours & Suji", icon: "🌾" },
  { name: "Rice & Rice Products", icon: "🍚" },
  { name: "Pulses & Dal", icon: "🥣" },
  { name: "Oil & Ghee", icon: "🧴" }, 
  { name: "Salts, Sugar & Jaggery", icon: "🧂" },
  { name: "Spices & Masalas", icon: "🥄" },
  { name: "Dry Fruits & Nuts", icon: "🥜" },
  { name: "Health Foods", icon: "🩺" },
  { name: "Teas & Coffee", icon: "☕" },
];

export default function CategoryMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    // Navigate to Menu.jsx with category query
    navigate(`/menu?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <nav className="bg-[#f9f7f2] px-2 sm:px-4 py-4 md:py-6">
      <div className="max-w-7xl mx-auto">
        <div className="md:hidden flex justify-center mb-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl font-semibold py-2 px-4 rounded-lg bg-white shadow-sm"
          >
            {menuOpen ? "Hide Categories" : "Show All Categories"}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden mb-4">
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => handleCategoryClick(category.name)}
                  className="flex flex-col items-center justify-center p-3 rounded-lg bg-white hover:shadow-md transition-all cursor-pointer"
                >
                  <span className="text-3xl mb-2">{category.icon}</span>
                  <span className="text-xs font-semibold text-center">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="hidden md:grid lg:hidden grid-cols-3 sm:grid-cols-4 gap-3">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(category.name)}
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-white hover:shadow-md transition-all cursor-pointer"
            >
              <span className="text-3xl mb-2">{category.icon}</span>
              <span className="text-sm font-semibold text-center">{category.name}</span>
            </div>
          ))}
        </div>
        <div className="hidden lg:grid grid-cols-10 gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(category.name)}
              className="flex flex-col items-center justify-center p-5 rounded-lg bg-white hover:shadow-lg transition-all cursor-pointer"
            >
              <span className="text-4xl mb-3">{category.icon}</span>
              <span className="text-sm font-semibold text-center">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
