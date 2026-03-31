import React from "react";
import { Link } from "react-router-dom";

const Shippingpolicy = () => {
  return (
    <div className="min-h-screen bg-green-200">
      {/* Breadcrumb */}
      <div className="bg-green-100 px-6 py-3 text-sm text-[#6b3f1d]">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">_</span>
        <span>Shipping Policy</span>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-20 py-35">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl md:text-6xl font-semibold text-[#6b3f1d] mb-8">
            Shipping Policy
          </h1>

          <ul className="list-disc pl-6 space-y-4 text-green-900 leading-relaxed">
            <li>
              We offer free shipping across cities mentioned in the website for
              orders above Rs 599.
            </li>

            <li>
              Next Day Delivery in Mumbai, Delhi/NCR, Hyderabad, Bangalore,
              Kolkata – Order should be placed before 11am.
            </li>

            <li>
              Customers ordering after 2 pm will get their order day after
              tomorrow.
            </li>

            <li>Items will be shipped within 24 hours.</li>

            <li>
              Minimum delivery time – 1 day, Maximum delivery time – 3 days.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Shippingpolicy;