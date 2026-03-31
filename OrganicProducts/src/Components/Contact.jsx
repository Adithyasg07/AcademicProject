import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f4ea] via-[#d4edda] to-[#c3e6cb]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        <h1 className="text-4xl font-semibold text-[#2f5d3a] mb-12 text-center">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Contact Form */}
          <div className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl">
            <form className="space-y-6">
              
              <input
                type="text"
                placeholder="Name"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2f5d3a]"
              />

              <input
                type="email"
                placeholder="Email *"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2f5d3a]"
              />

              <input
                type="text"
                placeholder="Phone number"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2f5d3a]"
              />

              <input
                type="text"
                placeholder="Order Id"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2f5d3a]"
              />

              <textarea
                placeholder="Message"
                rows="6"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2f5d3a]"
              />

              {/* Checkbox */}
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <input type="checkbox" className="mt-1 accent-[#2f5d3a]" />
                <p>
                  By submitting this form, I consent to receive communications
                  from Organic Tattva through WhatsApp, SMS, email, phone calls,
                  and other channels, even if my number is registered on
                  DND/NDNC.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2f5d3a] text-white py-3 rounded-md hover:bg-[#244a2e] transition duration-300 font-medium"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-semibold mb-8 text-[#2f5d3a]">
              Contact Information
            </h2>

            <div className="space-y-6 text-gray-700">
              
              <div className="flex gap-4 items-start">
                <MapPin className="text-[#2f5d3a] mt-1" />
                <p>
                  Mehrotra Consumer Products Pvt. Ltd. <br />
                  26G, Sector 31, Ecotech 1, <br />
                  Greater Noida – 201308, India
                </p>
              </div>

              <div className="flex gap-4 items-center">
                <Phone className="text-[#2f5d3a]" />
                <p>+91 120 4260545</p>
              </div>

              <div className="flex gap-4 items-center">
                <Mail className="text-[#2f5d3a]" />
                <p>customersupport@organictattva.com</p>
              </div>
            </div>

            <hr className="my-8 border-green-200" />

            <p className="font-semibold text-gray-800">
              Work With Us Email :{" "}
              <span className="text-[#2f5d3a]">
                hr@organictattva.com
              </span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;