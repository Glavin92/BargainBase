import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  FaTimes,
  FaMinus,
  FaPlus,
  FaTrash,
  FaShoppingBag,
} from "react-icons/fa";
import { FiShoppingBag, FiTrash2, FiMinus, FiPlus, FiX } from "react-icons/fi";
import { RiShoppingCartLine } from "react-icons/ri";

const CartSidebar = ({
  isOpen,
  onClose,
  cartItems,
  removeFromCart,
  decreaseQuantity,
  addToCart,
}) => {
  const totalPrice = cartItems.reduce((total, item) => {
    // Remove non-numeric characters and convert to number
    const numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, ""));
    return total + numericPrice * item.quantity;
  }, 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-xl transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 flex flex-col`}
      >
        {/* Header */}
        <div className="p-5 border-b border-orange-100 flex justify-between items-center bg-orange-50">
          <div className="flex items-center space-x-3">
            <RiShoppingCartLine className="text-2xl text-orange-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Your Cart{" "}
              <span className="text-orange-600">({cartItems.length})</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-orange-100 transition-colors text-gray-500 hover:text-orange-700"
            aria-label="Close cart"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FiShoppingBag className="text-4xl text-orange-200 mb-4" />
              <p className="text-lg font-medium text-gray-500 mb-1">
                Your cart is empty
              </p>
              <p className="text-sm text-gray-400">
                Start shopping to add items
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl border border-orange-100 hover:shadow-sm transition-all"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0 bg-orange-50 rounded-lg overflow-hidden">
                    <img
                      src={item.thumbnail || "https://via.placeholder.com/200"}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item)}
                        className="text-gray-400 hover:text-orange-600 transition-colors ml-2"
                        aria-label="Remove item"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.brand}</p>
                    <p className="text-base font-semibold text-orange-600 mt-1">
                      {item.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center mt-3">
                      <button
                        onClick={() => decreaseQuantity(item)}
                        className="w-8 h-8 flex items-center justify-center border border-orange-200 rounded-l-lg hover:bg-orange-50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus size={14} className="text-orange-600" />
                      </button>
                      <div className="w-10 h-8 flex items-center justify-center border-t border-b border-orange-200 text-sm font-medium text-orange-700">
                        {item.quantity}
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-8 h-8 flex items-center justify-center border border-orange-200 rounded-r-lg hover:bg-orange-50 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <FiPlus size={14} className="text-orange-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-orange-100 bg-orange-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-gray-800">
                Subtotal:
              </span>
              <span className="text-xl font-bold text-orange-600">
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex flex-col space-y-3">
              <Link
                to="/cart"
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors text-center font-medium flex items-center justify-center"
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                className="w-full bg-white border-2 border-orange-600 text-orange-600 py-3 rounded-lg hover:bg-orange-50 transition-colors text-center font-medium"
              >
                Checkout Now
              </Link>
            </div>
          </div>
        )}
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
