import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

const ProductDetails = () => {
  const products = [
    {
      id: 1,
      name: "Desi Cow Ghee",
      description: "Pure A2 Desi Cow Ghee",
      images: ["/ghee.png", "/ghee2.png", "/ghee3.png", "/ghee4.png"],
      sizes: [
        { label: "500ml", price: 1099 },
        { label: "1L", price: 2198 },
      ],
    },
    {
      id: 2,
      name: "Cold Pressed Mustard Oil",
      description: "Pure cold pressed mustard oil",
      images: ["/mustard.png", "/mustard1.png", "/mustard2.png", "/mustard3.png"],
      sizes: [
        { label: "500ml", price: 349 },
        { label: "1L", price: 698 },
      ],
    },
    {
      id: 3,
      name: "Organic Toor Dal",
      description: "Premium quality organic dal",
      images: ["/dal.png", "/dal1.png", "/dal2.png", "/dal3.png"],
      sizes: [
        { label: "1kg", price: 349 },
        { label: "2kg", price: 698 },
      ],
    },
    {
      id: 4,
      name: "Organic Makhana",
      description: "Healthy roasted makhana",
      images: ["/makhana.png", "/makhana1.png", "/makhana2.png", "/makhana3.png"],
      sizes: [
        { label: "250g", price: 499 },
        { label: "500g", price: 998 },
      ],
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [cartMessage, setCartMessage] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const openProduct = (product) => {
    setSelectedProduct(product);
    setMainImage(product.images[0]);
    setSelectedSize(product.sizes[0]);
    setQuantity(1);
  };

  const goBack = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = () => {
    setCartMessage(`${quantity} item added to cart`);
    setTimeout(() => setCartMessage(""), 3000);
  };

  const handleBuyNow = () => {
    setShowPayment(true);
  };

  const confirmPayment = () => {
    if (!paymentMethod) {
      alert("Please select payment method");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowPayment(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 2000);
  };

  // ================= PRODUCT LIST =================
  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto p-12">
        <h1 className="text-4xl font-bold mb-12 text-center">
          Our Products
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg shadow-lg p-6 text-center flex flex-col items-center justify-center hover:shadow-xl transition"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-64 w-full object-contain mb-6"
              />

              <h2 className="font-bold text-xl mb-4">
                {product.name}
              </h2>

              <button
                onClick={() => openProduct(product)}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                View Product
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ================= PRODUCT DETAIL =================
  return (
    <div className="max-w-7xl mx-auto p-10 flex flex-col md:flex-row items-center gap-16">

      {/* IMAGE SECTION */}
      <div className="md:w-1/2 flex flex-col gap-6">
        <div className="bg-gray-50 p-6 shadow-lg rounded">
          <img
            src={mainImage}
            alt={selectedProduct.name}
            className="w-full h-[550px] object-contain mx-auto"
          />
        </div>
      </div>

      {/* DETAILS */}
      <div className="md:w-1/2 flex flex-col gap-6">
        <button onClick={goBack} className="text-blue-600 underline">
          ← Back
        </button>

        <h1 className="text-4xl font-bold">
          {selectedProduct.name}
        </h1>

        <p className="text-gray-600 text-lg">
          {selectedProduct.description}
        </p>

        {/* SIZE */}
        <div className="flex gap-3 flex-wrap">
          {selectedProduct.sizes.map((size) => (
            <button
              key={size.label}
              onClick={() => setSelectedSize(size)}
              className={`border px-5 py-3 rounded font-semibold ${
                selectedSize.label === size.label
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {size.label} | ₹{size.price}
            </button>
          ))}
        </div>

        <h2 className="text-3xl font-bold">
          ₹{selectedSize.price * quantity}
        </h2>

        {/* QUANTITY */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="border p-3 rounded"
          >
            <FaMinus />
          </button>

          <span className="font-bold text-xl">
            {quantity}
          </span>

          <button
            onClick={() => setQuantity(quantity + 1)}
            className="border p-3 rounded"
          >
            <FaPlus />
          </button>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700"
          >
            Add to Cart
          </button>

          <button
            onClick={handleBuyNow}
            className="flex-1 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
          >
            Buy Now
          </button>
        </div>

        {cartMessage && (
          <p className="text-green-600 font-semibold mt-2">
            {cartMessage}
          </p>
        )}
      </div>

      {/* PAYMENT MODAL */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96 flex flex-col gap-4">
            <h2 className="text-xl font-bold">
              Select Payment Method
            </h2>

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
              className="border p-2 rounded"
            >
              <option value="">-- Select --</option>
              <option value="Credit Card">
                Credit Card
              </option>
              <option value="Debit Card">
                Debit Card
              </option>
              <option value="UPI">UPI</option>
              <option value="Net Banking">
                Net Banking
              </option>
            </select>

            <button
              onClick={confirmPayment}
              disabled={isProcessing}
              className="bg-green-600 text-white py-2 rounded"
            >
              {isProcessing
                ? "Processing..."
                : `Pay ₹${
                    selectedSize.price * quantity
                  }`}
            </button>

            <button
              onClick={() => setShowPayment(false)}
              className="border py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded text-center shadow-lg">
            <h2 className="text-green-600 text-xl font-bold mb-2">
              Payment Successful 🎉
            </h2>
            <p>
              Your order has been placed successfully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;