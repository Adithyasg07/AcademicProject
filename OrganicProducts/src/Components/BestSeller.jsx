import { useEffect, useState } from "react";
import { FaStar, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { featuredProducts } from "../data/bestsellers";


export default function Bestseller() {
  const navigate = useNavigate();
  const { wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState(featuredProducts);

  const handleClick = (product) => {
    navigate("/ProductInformation", { state: { product: { ...product, isBestseller: true } } });
  };

  const handleWishlist = async (e, item) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert("Please login to manage wishlist");
      navigate("/login");
      return;
    }
    if (isInWishlist(item.id)) {
      await removeFromWishlist(item.id);
    } else {
      await addToWishlist(item.id);
    }
  };

  return (
    <section className="px-6 py-12 bg-white">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
        Bestseller
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white cursor-pointer flex flex-col"
            onClick={() => handleClick(product)}
          >
            <div className="relative aspect-square bg-white flex items-center justify-center p-4">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <button 
                onClick={(e) => handleWishlist(e, product)}
                className={`absolute top-4 right-4 p-2.5 rounded-full shadow-sm transition-all z-10 ${
                  isInWishlist(product.id) 
                    ? "bg-red-500 text-white" 
                    : "bg-white text-gray-400 hover:text-red-500 border border-gray-100"
                }`}
              >
                <FaHeart size={14} />
              </button>
            </div>

            <div className="p-4 border-t border-gray-100 flex flex-col flex-grow">
              <h3 className="font-semibold text-gray-800 mb-1 text-sm line-clamp-2 min-h-[2.5rem]">
                {product.name}
              </h3>

              <div className="mt-auto">
                <p className="text-gray-600 text-sm mb-2">
                  From <span className="text-gray-900 font-bold">{product.price}</span>
                </p>

                <div className="flex items-center gap-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-xs ${i < Math.floor(product.rating) ? "fill-current" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-600 ml-1">{product.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}