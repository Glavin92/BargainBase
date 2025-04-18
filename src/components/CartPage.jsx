import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaMinus, FaPlus, FaTrash, FaArrowLeft } from "react-icons/fa";

const CartPage = ({ cartItems, removeFromCart, decreaseQuantity, addToCart }) => {
  const totalPrice = cartItems.reduce((total, item) => {
    // Extract numeric value from price string (e.g., "₹12,999" -> 12999)
    const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    return total + (price * item.quantity);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Your Shopping Cart</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {cartItems.length === 0 ? (
            <div className="p-12 text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {/* Cart Items */}
              <div className="p-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 py-4 first:pt-0 last:pb-0"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">{item.brand}</p>
                      <p className="text-lg font-semibold text-orange-500">
                        {item.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 border rounded-lg p-1">
                        <button
                          onClick={() => decreaseQuantity(item)}
                          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <FaPlus size={12} />
                        </button>
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
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                  <span className="text-xl font-bold text-orange-500">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-4">
                  <Link
                    to="/checkout"
                    className="block w-full bg-orange-500 text-white py-3 px-4 rounded-lg text-center font-medium hover:bg-orange-600 transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    to="/"
                    className="block w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg text-center font-medium hover:bg-gray-300 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CartPage.propTypes = {
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

export default CartPage;