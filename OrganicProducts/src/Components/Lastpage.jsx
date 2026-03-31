import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaArrowRight,
} from "react-icons/fa";
import image from "/image.png";

function Lastpage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = () => {
    if (email.trim() === "") {
      setMessage("Please enter a valid email");
      return;
    }
    setMessage(`Thank you for subscribing, ${email}!`);
    setEmail("");
  };

  return (
    <footer className="bg-[#4b5f2f] text-white px-8 md:px-16 py-14">
      
      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        
        {/* Company Info */}
        <div className="space-y-4">
          <img src={image} alt="Organic Tattva" className="w-36" />
          <p className="text-sm leading-relaxed text-gray-100">
            We've turned the wheel full circle at Organic Tattva, by building a
            culture that thrives on health, ecology, fairness, and care.
          </p>
        </div>

        {/* Policies */}
        <div>
          <h3 className="font-semibold mb-4 text-lg">Policies</h3>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Contact Us", path: "/Contact" },
              { name: "About Us", path: "/Aboutus" },
              { name: "FAQ", path: "/Faq" },
              { name: "Privacy Policy", path: "/Privacypolicy" },
              { name: "Shipping Policy", path: "/shippingpolicy" },
              { name: "Cancellation & Return Policy", path: "/Cancellationreturnpolicy" },
              { name: "Terms & Conditions", path: "/TermsandConditions" },
            ].map((item) => (
              <li key={item.name}>
                <Link to={item.path} className="hover:text-gray-200 transition">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Cities */}
        <div>
          <h3 className="font-semibold mb-4 text-lg">Cities We Serve</h3>
          <ul className="space-y-2 text-sm">
            {[
              "Delhi NCR",
              "Bangalore",
              "Mumbai",
              "Hyderabad",
              "Kolkata",
              "PAN India",
            ].map((city) => (
              <li key={city} className="hover:text-gray-200 cursor-pointer">
                {city}
              </li>
            ))}
          </ul>
        </div>

        {/* Subscribe & Social */}
        <div className="space-y-5">
          <h3 className="font-semibold text-lg">Subscribe to our emails</h3>

          {/* Email Input */}
          <div className="flex items-center border border-white rounded-md overflow-hidden">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 text-white bg-transparent outline-none placeholder-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="px-4 py-2 hover:bg-white hover:text-[#4b5f2f] transition" onClick={handleSubscribe}>
              <FaArrowRight />
            </button>
          </div>

          {message && (
            <p className="text-sm text-green-300">{message}</p>
          )}

          {/* Social Icons */}
          <div className="flex gap-4 pt-2">

            <a
              href="https://www.facebook.com/OrganicTattva"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white rounded-full p-3 hover:bg-white hover:text-[#4b5f2f] transition"
            >
              <FaFacebookF size={16} />
            </a>

            <a
              href="https://www.instagram.com/organictattva"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white rounded-full p-3 hover:bg-white hover:text-[#4b5f2f] transition"
            >
              <FaInstagram size={16} />
            </a>

            <a
              href="https://www.youtube.com/@organictattva2013"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white rounded-full p-3 hover:bg-white hover:text-[#4b5f2f] transition"
            >
              <FaYoutube size={16} />
            </a>

            <a
              href="https://www.linkedin.com/company/organictattva/"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white rounded-full p-3 hover:bg-white hover:text-[#4b5f2f] transition"
            >
              <FaLinkedinIn size={16} />
            </a>

          </div>
        </div>

      </div>
    </footer>
  );
}

export default Lastpage;