import React from "react";

const features = [
  {
    label: "Sustainable Farming Techniques",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.8EEy4qMGgt3y2AMJdHwV0gAAAA?pid=ImgDet&w=120&h=120&c=7&dpr=1.3&rs=1&o=7&rm=3.png",
  },
  {
    label: "Chemical Pesticide-Free",
    image: "/pesticide_free_icon.png",
  },
  {
    label: "Non-GMO Produce",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.nbkF4PC3OHw2gs46z6XFBAAAAA?pid=ImgDet&w=150&h=150&c=7&dpr=1.3&o=7&rm=3.png",
  },
  {
    label: "Locally Ethically Sourced",
    image:
      "https://tse1.mm.bing.net/th/id/OIP.r-IIn9MXzETo6XM0Ck_fxQAAAA?pid=ImgDet&w=150&h=150&c=7&dpr=1.3&o=7&rm=3.png",
  },
  {
    label: "250 Global Testing Standards",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.NCI8gmqFiN-vhBb5AgJJ_QAAAA?pid=ImgDet&w=128&h=128&c=7&dpr=1.3&o=7&rm=3.png",
  },
];

export default function WhyChooseOrganicTattva() {
  return (
    <section className="bg-white py-16 px-10">
      <h2 className="text-center text-5xl font-semibold text-[#5a2d0c] mb-14">
        Why Choose Organic Tattva
      </h2>

      <div className="flex flex-wrap items-center justify-center gap-10">
        {features.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center max-w-[180px] text-[#6b4a2b] text-sm"
          >
            <div className="overflow-hidden">
              <img
                src={item.image}
                alt={item.label}
                className="w-20 h-20 object-contain cursor-pointer 
                           transition-transform duration-300 ease-in-out
                           hover:scale-150"
              />
            </div>
            <p className="mt-5">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}