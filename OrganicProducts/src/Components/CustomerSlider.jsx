import { useRef, useState, useEffect } from "react";

const data = [
  {
    id: 1,
    title: "Organic Whole Wheat Flour",
    review:
      "Atta is fresh, soft, and makes chapatis that stay fluffy and tasty for long.  Truly good and healthy choice.",
    name: "Neelam Sharma",
    reviewerImage:
      "https://organictattva.com/cdn/shop/files/Neelam_Sharma.png?v=1758697897&width=375",
    productImage:
      "https://organictattva.com/cdn/shop/files/8906055440247_01_936560d9-7c1f-4ce3-8e0c-746f2a7db092.png?v=1765541202&width=750",
  },
  {
    id: 2,
    title: "Organic Sonamasuri Rice",
    review:
      "Best quality rice, fresh appearance and well packed. Cooks at normal time.",
    name: "Jagdish",
    reviewerImage:
      "https://organictattva.com/cdn/shop/files/Jagdish.png?v=1758697896&width=375",
    productImage:
      "https://organictattva.com/cdn/shop/files/8906055440483_01_59177bcc-7ec6-4308-8462-52de6a3d5187.png?v=1765880614&width=750",
  },
  {
    id: 3,
    title: "Organic Ghee",
    review:
      "Very healthy taste. Color, texture and aroma are perfect.",
    name: "Punit Jain",
    reviewerImage:
      "https://organictattva.com/cdn/shop/files/Puneet_Jain.png?v=1758697897&width=375",
    productImage:
      "https://organictattva.com/cdn/shop/files/8906055442593_01.jpg?v=1758625656&width=750",
  },
];

export default function CustomerDraggableSlider() {
  const sliderRef = useRef(null);
  const CARD_WIDTH = 560;
  const [index, setIndex] = useState(0);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  /* ===== DRAG HANDLERS ===== */

  const onDragStart = (e) => {
    isDragging.current = true;
    startX.current =
      e.type === "mousedown" ? e.pageX : e.touches[0].pageX;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const onDragMove = (e) => {
    if (!isDragging.current) return;
    const x =
      e.type === "mousemove" ? e.pageX : e.touches[0].pageX;
    sliderRef.current.scrollLeft =
      scrollLeft.current + (startX.current - x);
  };

  const onDragEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const newIndex = Math.round(
      sliderRef.current.scrollLeft / CARD_WIDTH
    );
    setIndex(newIndex);
    sliderRef.current.scrollTo({
      left: newIndex * CARD_WIDTH,
      behavior: "smooth",
    });
  };

  /* ===== AUTO SLIDE ===== */

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % data.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    sliderRef.current?.scrollTo({
      left: index * CARD_WIDTH,
      behavior: "smooth",
    });
  }, [index]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-5xl font-semibold mb-10 text-[#5a2d0c]">
        From Our Customers
      </h2>

      <div
        ref={sliderRef}
        className="flex gap-8 overflow-x-hidden cursor-grab"
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={onDragStart}
        onTouchMove={onDragMove}
        onTouchEnd={onDragEnd}
      >
        {data.map((item) => (
          <div
            key={item.id}
            className="min-w-[560px] bg-white rounded-2xl shadow-lg p-6 flex gap-6 flex-shrink-0"
          >
            {/* PRODUCT IMAGE */}
            <div className="w-[260px] h-[260px] flex-shrink-0">
              <img
                src={item.productImage}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* REVIEW CONTENT */}
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-[#3d2b1f]">
                  {item.title}
                </h3>

                <p className="text-lg leading-8 text-gray-700 max-w-md">
                  “{item.review}”
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <img
                  src={item.reviewerImage}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <p className="text-lg font-medium text-[#3d2b1f]">
                  {item.name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
