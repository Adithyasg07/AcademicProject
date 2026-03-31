import { useState } from 'react';
import { Link } from 'react-router-dom';

import Navbar from './Navbar';
import Categories from './Categories';
import Video from './Video';
import WishlistDrawer from './WishlistDrawer';
import Bestseller from './BestSeller';
import WhyChooseOrganicTattva from './WhyChooseOrganicTattva';
import CustomerSlider from './CustomerSlider';
import Recipes from './Recipes';
import Certifications from './Certifications';
import Lastpage from './Lastpage';

function ZoomIcon({ icon: Icon, name, zoomedIcon, onTouch }) {
  const isZoomed = zoomedIcon === name;
  return (
    <div
      onClick={() => onTouch(name)}
      className={`transition-transform duration-300 cursor-pointer ${
        isZoomed ? 'scale-125' : ''
      }`}
    >
      <Icon />
    </div>
  );
}

export default function HomePage() {
  const [zoomedIcon, setZoomedIcon] = useState(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const handleIconTouch = (iconName) => {
    setZoomedIcon(iconName);
    setTimeout(() => setZoomedIcon(null), 300);
  };

  // Add item to wishlist (example: from Bestseller or ProductDetail)
  const addToWishlist = (product) => {
    const exists = wishlist.find((p) => p.id === product.id);
    if (!exists) {
      setWishlist([...wishlist, product]);
    }
  };

  return (
    <>
      <Navbar />

      {/* Main Content */}
      <main className="px-4">
        <Categories />
        <Video />
        <Bestseller addToWishlist={addToWishlist} />
        <WhyChooseOrganicTattva />
        <CustomerSlider />
        <Recipes />
        <Certifications />

        <div className="text-center my-10">
          <Link
            to="/menu"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Shop All Products
          </Link>
        </div>
      </main>

      {/* Drawers */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlist}
      />

      <Lastpage />
    </>
  );
}