import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const Faq = () => {
  const faqs = [
    {
      question: "What is Organic Tattva?",
      answer:
        "Organic Tattva is a brand offering 100% certified organic food products sourced directly from trusted organic farmers across India.",
    },
    {
      question: "Why should I choose Organic Tattva products?",
      answer:
        "Organic Tattva products are free from harmful chemicals and pesticides, ensuring purity, nutrition, and sustainability.",
    },
    {
      question: "In which cities do you deliver?",
      answer:
        "We deliver Organic Tattva products across major cities and towns in India through our logistics partners.",
    },
    {
      question: "How can I place an order?",
      answer:
        "You can place an order directly through our website by selecting products and completing the checkout process.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Delivery usually takes 3–7 business days depending on your location.",
    },
    {
      question: "Are your product certified organic?",
      answer:
        "Yes. We carry recognized certifications including India Organic, USDA Organic, BRC Global Standards, Kosher, Jaivik Bharat, among others.",
    },
    {
      question: "Do you test for pesticides or contaminants?",
      answer:
        "Yes. Every product goes through rigorous testing (up to 250 pesticide residue checks) to ensure safety and quality.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 bg-green-100 ">
      <h2 className="text-5xl font-semibold text-black mb-8 text-center">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg bg-green-100"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center px-6 py-4 text-left text-green-900 font-medium"
            >
              {faq.question}
              <ChevronDown
                className={`transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {openIndex === index && (
              <div className="px-6 pb-4 text-green-800">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;