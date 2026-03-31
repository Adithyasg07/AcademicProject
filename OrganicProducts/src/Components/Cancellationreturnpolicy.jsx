import React from "react";
import { Link } from "react-router-dom";

const Cancellationreturnpolicy = () => {
  return (
    <div className="bg-green-200">
      {/* Breadcrumb */}
      <div className="bg-gray-100 px-6 py-3 text-sm text-[#6b3f1d]">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-3">_</span>
        <span>Cancellation / Return Policy</span>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12 text-gray-800">
        <h1 className="text-6xl font-semibold text-[#6b3f1d] mb-6">
          Cancellation / Return Policy
        </h1>

        <p className="mb-8 leading-relaxed">
          <strong>Mehrotra Consumer Products Pvt. Ltd</strong> endeavors to
          provide highest quality products to our customer. However, in case,
          you are dissatisfied with the buying experience or have concerns with
          regards to the delivered products, following shall be the appropriate
          process with regards to order cancellation or product return.
        </p>

        {/* Cancellation */}
        <h2 className="text-xl font-semibold mb-4">Cancellation:</h2>
        <ul className="list-disc pl-6 space-y-3 mb-8">
          <li>
            In case if you would like to rethink your purchase, you can cancel
            your order at any point until it is out for delivery and your money
            will be refunded to your original source of payment.
          </li>
          <li>
            It will be initiated instantly at the time of cancellation and
            credited to your payment source in maximum of 5–7 business days.
          </li>
          <li>
            Please note that once your order is out for delivery, it cannot be
            cancelled or refunded.
          </li>
        </ul>

        {/* Return Policy */}
        <h2 className="text-xl font-semibold mb-4">Return Policy</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            Any returns due to default of the company of damaged product or bad
            product quality will be taken into the consideration.
          </li>
          <li>
            However, <strong>Mehrotra Consumer Products Pvt. Ltd</strong> will
            enquire about this and take action against it.
          </li>
          <li>
            Item return request can be initiated not beyond 36 hours of
            successful delivery of the order.
          </li>
          <li>
            Item return request can be raised by writing to us on{" "}
            <strong>customercare@organictattva.com</strong>. It will be mandatory
            to provide product images in case of damages, in the email.
          </li>
          <li>
            Item return request shall be subject to approval by the company
            after due verification.
          </li>
          <li>
            All returned items must be in new and unopened condition, with all
            original receipt and packaging.
          </li>
          <li>
            In case of any queries you may contact us on{" "}
            <strong>(120) 426 0545</strong> or write to us on{" "}
            <strong>customercare@organictattva.com</strong>.
          </li>
          <li>Product returns are subject to approval by the company.</li>
        </ul>
      </div>
    </div>
  );
};

export default Cancellationreturnpolicy;