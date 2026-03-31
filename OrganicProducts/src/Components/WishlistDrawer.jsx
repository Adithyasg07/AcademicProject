import { FaTimes } from "react-icons/fa";

export default function WishlistDrawer({ isOpen, onClose, wishlistItems }) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Your Wishlist</h2>
          <button onClick={onClose}>
            <FaTimes className="text-gray-600 text-xl" />
          </button>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center px-6 h-[80%]">
            <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">
              Add products you love to see them here!
            </p>
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-4 overflow-y-auto h-[80%]">
            {wishlistItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center gap-3">
                  <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.size?.label || ''} | ₹{item.size?.price || item.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}