import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const CartPage = ({ cartItems, removeFromCart, decreaseQuantity, addToCart }) => {
  
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

     
      <div className="bg-white rounded-lg shadow-md p-6 mx-16">
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="mb-4">Your cart is empty.</p>
            <Link to="/" className="text-orange-500 hover:underline">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
           
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                 
                  <img src={item.image} alt={item.title} className="w-20 h-20 object-contain" />

                 
                  <div className="flex-1 ml-4">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>

               
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="text-gray-500 hover:text-black"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                    <button
                      onClick={() => addToCart(item)}
                      className="text-gray-500 hover:text-black"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  
                  <p className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</p>

                 
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

           
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between text-xl font-semibold">
                <span>Subtotal:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              
              <div className="mt-6 flex gap-4">
                <Link
                  to="/"
                  className="w-1/2 text-center bg-gray-200 text-black py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Continue Shopping
                </Link>
                <Link to="/checkout" className="w-1/2 bg-orange-500 text-white py-3 pl-72 rounded-lg hover:bg-orange-600 transition-colors">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

CartPage.propTypes = {
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

export default CartPage;