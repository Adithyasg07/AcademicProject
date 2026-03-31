import React from "react";

const Aboutus = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f4ea] via-[#d4edda] to-[#c3e6cb] px-5 sm:px-10 lg:px-24 py-16">
      
      <h1 className="text-4xl sm:text-5xl text-center font-semibold text-[#2f5d3a] mb-14">
        About Us
      </h1>

      {/* About Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">

        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold text-[#2f5d3a] mb-4">
            🌿 Our Mission
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Organic Tattva is committed to providing 100% certified organic food 
            products that promote healthier living and sustainable farming.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold text-[#2f5d3a] mb-4">
            🌾 Our Sourcing
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We work closely with organic farmers across India to source high-quality 
            ingredients grown without harmful chemicals.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold text-[#2f5d3a] mb-4">
            ✅ Quality Commitment
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Strict quality standards ensure purity, freshness, and authentic natural taste.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold text-[#2f5d3a] mb-4">
            🌍 Sustainability
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We promote conscious eating and environmentally responsible farming practices.
          </p>
        </div>

      </div>

      {/* Leadership Section */}
      <div className="mt-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-[#2f5d3a] mb-12">
          Our Leadership
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Founder Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <img
              src="https://organictattva.com/cdn/shop/files/Rohit_Sir.png?v=1719480795&width=750.jpg"   // Add this image in public folder
              alt="Rohit"
              className="w-40 h-40 object-cover rounded-full mx-auto mb-6 border-4 border-[#2f5d3a]"
            />
            <h3 className="text-2xl font-semibold text-[#2f5d3a]">
              Rohit
            </h3>
            <p className="text-sm text-gray-500 mb-4">Founder of CEO</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Rohit founded Organic Tattva with a vision to make certified 
              organic food accessible to Indian households. His mission is to 
              promote healthy living and support sustainable farming practices.
            </p>
          </div>

          {/* CEO Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <img
              src="https://organictattva.com/cdn/shop/files/kriti.png?v=1719480564&width=750.jpg"  // Same image since he is also CEO
              alt="Kapil Bansal CEO"
              className="w-40 h-40 object-cover rounded-full mx-auto mb-6 border-4 border-[#2f5d3a]"
            />
            <h3 className="text-2xl font-semibold text-[#2f5d3a]">
              Kriti
            </h3>
            <p className="text-sm text-gray-500 mb-4">Founder of CEO</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              As CEO, Kriti leads the company’s growth strategy, ensuring 
              quality, innovation, and expansion while staying committed to 
              organic integrity and environmental sustainability.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Aboutus;