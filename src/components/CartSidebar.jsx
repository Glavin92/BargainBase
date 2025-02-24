import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const CartSidebar = ({ isOpen, onClose, cartItems, removeFromCart, decreaseQuantity, addToCart }) => {
 
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
      
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 transition-opacity duration-300 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

  
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg transform ${isOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 z-60 flex flex-col`} 
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Your Cart ({cartItems.length})</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black" aria-label="Close cart">
            ✕
          </button>
        </div>

        
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-2">
                <img src={item.image} alt={item.title} className="w-16 h-16 object-contain" />
                <div className="flex-1 ml-4">
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="text-gray-500 hover:text-black"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                    <button
                      onClick={() => addToCart(item)}
                      className="text-gray-500 hover:text-black"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-red-500">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 font-bold hover:text-red-700"
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart Actions */}
        <div className="p-4 border-t">
          <div className="flex justify-between font-semibold text-lg">
            <span>Subtotal:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="mt-4 flex gap-2">
            <Link
              to="/cart"
              className="w-1/2 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors text-center"
            >
              View Cart
            </Link>
            <Link
              to="/checkout"
              className="w-1/2 bg-black text-white py-2 p-10 rounded hover:bg-gray-800 transition-colors">
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
      title: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  removeFromCart: PropTypes.func.isRequired,
  decreaseQuantity: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default CartSidebar;