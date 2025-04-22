import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaTimes, FaMinus, FaPlus, FaTrash } from "react-icons/fa";

const CartSidebar = ({ isOpen, onClose, cartItems, removeFromCart, decreaseQuantity, addToCart }) => {
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity); // Directly use the number
  }, 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 transition-opacity duration-300 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 w-96 h-full bg-white shadow-xl transform ${isOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 z-50 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">
            Your Cart ({cartItems.length})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close cart"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg mb-2">Your cart is empty</p>
              <p className="text-sm">Start shopping to add items</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg"
              >
                {/* Product Image */}
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-contain rounded"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">{item.brand}</p>
                  <p className="text-lg font-semibold text-orange-500">
                    {item.price}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => decreaseQuantity(item)}
                      className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove item"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-800">Subtotal:</span>
            <span className="text-xl font-bold text-orange-500">
              ₹{totalPrice.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col space-y-2">
            <Link
              to="/cart"
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors text-center font-medium"
            >
              View Cart
            </Link>
            <Link
              to="/checkout"
              className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors text-center font-medium"
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

CartSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      thumbnail: PropTypes.string,
      price: PropTypes.string.isRequired,
      brand: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  removeFromCart: PropTypes.func.isRequired,
  decreaseQuantity: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default CartSidebar;