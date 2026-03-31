import React from "react";

const certifications = [
  {
    id: 1,
    name: "BRC Global",
    img: "https://organictattva.com/cdn/shop/files/BRC-Global-Logo.png?v=1716533309&width=450"
  },
  {
    id: 2,
    name: "India Organic",
    img: "https://organictattva.com/cdn/shop/files/India-Organic-Logo.png?v=1716533375&width=450"
  },
  {
    id: 3,
    name: "Sedex",
    img: "https://organictattva.com/cdn/shop/files/Sedex-Logo.png?v=1716533374&width=450"
  },
  {
    id: 4,
    name: "USDA Organic",
    img: "https://organictattva.com/cdn/shop/files/USDA-Logo.png?v=1716533375&width=450"
  },
  {
    id: 5,
    name: "Jaivik Bharat",
    img: "https://organictattva.com/cdn/shop/files/Jaivik-Bharat-Logo.png?v=1716533375&width=450"
  },
  {
    id: 6,
    name: "Kosher",
    img: "https://organictattva.com/cdn/shop/files/image_3.png?v=1758632050&width=450"
  }
];

export default function OrganicCertifications() {
  return (
    <section className="bg-[#faf8f5] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-[#5a3a1a] mb-14">
          Organic Certifications
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-20">
          {certifications.map(cert => (
            <div
              key={cert.id}
              className="w-28 h-28 flex items-center justify-center rounded-full bg-white shadow-sm"
            >
              <img
                src={cert.img}
                alt={cert.name}
                className="max-w-[90%] max-h-[90%] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
