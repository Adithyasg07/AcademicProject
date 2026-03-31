import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiService } from "../api/apiService";

export default function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert("Please login to proceed with checkout.");
      onClose();
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    try {
      const orderReq = {
        totalAmount: getCartTotal(),
        paymentMethod: "UPI"
      };
      await apiService.post("/Orders", orderReq);
      
      setIsProcessing(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        clearCart();
        setShowSuccess(false);
        onClose();
        navigate("/userdashboard");
      }, 2000);
    } catch (err) {
      setIsProcessing(false);
      alert("Failed to place order.");
    }
  };
  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Your cart</h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-600 text-xl" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-60px)]">
          {!cartItems || cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center px-6 h-full">
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Not sure where to start? <br />Try these collections:</p>
              <button onClick={onClose} className="border px-6 py-3 rounded hover:bg-gray-100 transition">Continue shopping</button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h4 className="font-semibold">{item.productName}</h4>
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                      <p className="text-green-700 font-bold">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 ml-2">X</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>Total:</span>
                  <span>₹{getCartTotal()}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-green-700 text-white py-3 rounded hover:bg-green-800 transition font-bold"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {/* PROCESSING OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] backdrop-blur-md bg-white/30 flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center space-y-4 max-w-xs w-full">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h2 className="text-xl font-bold text-gray-800">Processing Payment</h2>
            <p className="text-gray-500 text-sm">Please do not refresh the page or close the window.</p>
          </div>
        </div>
      )}

      {/* SUCCESS OVERLAY */}
      {showSuccess && (
        <div className="fixed inset-0 z-[110] backdrop-blur-sm bg-white/20 flex items-center justify-center p-6">
          <div className="bg-white p-10 rounded-3xl shadow-2xl text-center transform animate-bounce-short max-w-sm w-full">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <FaTimes size={40} className="rotate-45" /> {/* Just a placeholder for checkmark if I had one, or use FaTimes rotated */}
            </div>
            <h2 className="text-2xl font-bold text-green-700">Payment Successful! 🎉</h2>
            <p className="text-gray-600 mt-2">Redirecting to your dashboard...</p>
          </div>
        </div>
      )}
    </>
  );
}
