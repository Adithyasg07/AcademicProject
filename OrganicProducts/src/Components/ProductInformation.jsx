import React, { useState, useEffect } from "react";
import { FaMinus, FaPlus, FaStar, FaHeart } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { apiService } from "../api/apiService";
import { featuredProducts } from "../data/bestsellers";
import Navbar from "./Navbar";

const ProductInformation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { product } = location.state || {};

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [cartMessage, setCartMessage] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (product) {
      let formattedProduct;

      // Senior Fix: Ensure static products (ID 1-60) always use their high-quality local images.
      const isStatic = product.id <= 60;
      const finalImage = (isStatic && !product.img?.startsWith("http")) ? product.img : (product.img || "/logo.png");

      if (product.sizes && product.sizes.length > 0) {
        formattedProduct = {
          ...product,
          img: finalImage,
          description: product.description || "Premium organic quality product",
          images: product.gallery?.length > 0 ? product.gallery : [finalImage, finalImage, finalImage, finalImage],
        };

        setSelectedSize(product.sizes[0]);
      } else {
        const numericPrice = Number(
          product.price?.toString().replace("₹", "").replace(",", "") || 0
        );

        formattedProduct = {
          ...product,
          img: finalImage,
          description: "Premium organic quality product",
          images: [finalImage, finalImage, finalImage, finalImage],
          sizes: [{ label: "Standard", price: numericPrice }],
        };

        setSelectedSize({ label: "Standard", price: numericPrice });
      }

      setSelectedProduct(formattedProduct);
      setMainImage(finalImage);
      setQuantity(1);
    }
  }, [product]);

  if (!selectedProduct || !selectedSize) {
    return <div className="p-10 text-center text-xl">Product not found</div>;
  }

  const confirmPayment = async () => {
    if (!paymentMethod) {
      alert("Please select payment method");
      return;
    }

    setIsProcessing(true);
    try {
      const orderReq = {
        totalAmount: selectedSize.price * quantity,
        paymentMethod: paymentMethod
      };
      
      // For "Buy Now", we typically place an order for THIS specific item.
      // However, our backend PlaceOrderFromCart clears the cart and moves ALL current cart items.
      // So to implement a true "Buy Now", we should probably add this item to cart first if it's not there,
      // and then call PlaceOrder.
      
      await addToCart(selectedProduct, selectedSize, quantity);
      await apiService.post("/Orders", orderReq);
      
      setIsProcessing(false);
      setShowPayment(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/userdashboard");
      }, 2000);
    } catch (err) {
      alert("Failed to place order.");
      setIsProcessing(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      alert("Please login to manage wishlist");
      navigate("/login");
      return;
    }
    const productId = selectedProduct.id;
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 pt-20">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white shadow-xl rounded-2xl p-6 sm:p-8">

        {/* LEFT SIDE IMAGES */}
        <div>

          {/* MAIN IMAGE */}
          <div className="overflow-hidden bg-gray-50 rounded-xl">
            <img
              src={mainImage}
              alt={selectedProduct?.name}
              className="w-full h-[300px] sm:h-[400px] lg:h-[450px] object-contain hover:scale-105 transition duration-300"
            />
          </div>

        </div>

        {/* RIGHT SIDE DETAILS */}
        <div className="flex flex-col gap-5">

          {/* BACK LINK */}
          <button 
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mb-2 font-medium"
          >
            ← Back
          </button>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            {selectedProduct?.name}
          </h1>

          <p className="text-gray-500 font-medium text-sm sm:text-base">
            {selectedProduct?.subtitle || selectedProduct?.description}
          </p>

          {/* RATING */}
          <div className="flex items-center gap-1 text-yellow-500 text-lg">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <span className="text-gray-400 ml-2 text-sm">
              (120 reviews)
            </span>
          </div>

          {/* SIZE SELECTOR */}
          <div className="flex flex-wrap gap-3 mt-2">
            {selectedProduct?.sizes?.map((size) => (
              <button
                key={size.label}
                onClick={() => setSelectedSize(size)}
                className={`px-6 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all transform active:scale-95 shadow-sm
                ${
                  selectedSize?.label === size.label
                    ? "bg-green-600 text-white shadow-green-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {size.label} | ₹{size.price}
              </button>
            ))}
          </div>

          {/* PRICE */}
          <div className="flex flex-col gap-1 mt-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              ₹{(selectedSize?.price || 0) * quantity}
            </h2>
          </div>

          {/* QUANTITY */}
          <div className="flex items-center gap-4">

            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-3 rounded-lg border hover:bg-gray-100"
            >
              <FaMinus />
            </button>

            <span className="text-xl font-bold">{quantity}</span>

            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-3 rounded-lg border hover:bg-gray-100"
            >
              <FaPlus />
            </button>

          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">

            <button
              onClick={async () => {
                const success = await addToCart(selectedProduct, selectedSize, quantity);
                if (success) {
                  setCartMessage(`${quantity} item(s) added to cart!`);
                  setTimeout(() => setCartMessage(""), 3000);
                }
              }}
              className="flex-1 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-green-500 to-green-700 hover:scale-105 transition"
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  alert("Please login first to Buy Now");
                  navigate("/login");
                  return;
                }
                setShowPayment(true);
              }}
              className="flex-1 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-105 transition shadow-lg"
            >
              Buy Now
            </button>

            <button
              onClick={handleWishlistToggle}
              className={`p-4 rounded-lg border transition-all transform hover:scale-110 active:scale-95 ${isInWishlist(selectedProduct?.id) ? 'bg-red-50 text-red-500 border-red-200' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}
              title={isInWishlist(selectedProduct?.id) ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <FaHeart size={20} />
            </button>

          </div>

          {cartMessage && (
            <p className="text-green-600 font-semibold">
              {cartMessage}
            </p>
          )}

        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPayment && (
        <div className={`fixed inset-0 flex items-center justify-center px-4 z-[100] transition-all duration-300 ${isProcessing ? 'backdrop-blur-md bg-white/30' : 'bg-black/40'}`}>

          <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-sm flex flex-col gap-4 shadow-2xl transform transition-all">

            <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
              Payment Method
            </h2>
            
            <div className="space-y-3">
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-500 outline-none transition"
                disabled={isProcessing}
              >
                <option value="">Select Payment</option>
                <option value="UPI">UPI</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
              </select>

              <button
                onClick={confirmPayment}
                disabled={isProcessing || !paymentMethod}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
                  isProcessing 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-green-600 hover:bg-green-700 active:scale-95"
                }`}
              >
                {isProcessing
                  ? <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  : `Pay ₹${(selectedSize?.price || 0) * quantity}`}
              </button>

              {!isProcessing && (
                <button
                  onClick={() => setShowPayment(false)}
                  className="w-full py-3 rounded-xl border-2 border-gray-100 font-semibold text-gray-500 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center px-4 z-[110] backdrop-blur-sm bg-white/20">
          <div className="bg-white p-8 sm:p-10 rounded-3xl text-center shadow-2xl transform animate-bounce-short">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <FaStar size={40} className="animate-pulse" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-700">
              Payment Successful 🎉
            </h2>
            <p className="text-gray-600 mt-2 font-medium">
              Your order has been placed successfully.
            </p>
            <p className="text-gray-400 text-sm mt-1">Redirecting to your dashboard...</p>
          </div>
        </div>
      )}
        </div>
    </>
  );
};

export default ProductInformation;