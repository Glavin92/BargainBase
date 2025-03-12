import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import bargainBase from "../assets/bargainBase.png";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaStore, FaTruck, FaRegUser } from "react-icons/fa";
import { FiSmartphone, FiShoppingCart } from "react-icons/fi";
import { VscSearch } from "react-icons/vsc";
import CartSidebar from "./CartSidebar";
import { signOut } from "firebase/auth"; 
import { auth } from "./firebase"; 

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="hover:text-blue-700 focus:outline-none"
      >
        Pages
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <Link to="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">About Us</Link>
            <Link to="/faq" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">FAQ</Link>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="hover:text-blue-700 focus:outline-none"
      >
        <FaRegUser className="text-xl text-gray-700 hover:text-orange-600 cursor-pointer" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {user ? (
              <button
                onClick={() => signOut(auth)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link to="/signin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign In</Link>
                <Link to="/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = ({ cartItems, removeFromCart, decreaseQuantity, addToCart, user, onSearch, onCategoryChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* Top Banner */}
      <div className="bg-black text-white text-sm font-medium flex justify-between px-28 py-2">
        <div className="flex space-x-3">
          <FaStore className="text-red-500" />
          <h1 className="px-2">Welcome to Our Store BargainBase</h1>
          <FaTruck className="text-red-500" />
          <h1 className="px-2">Free Shipping Worldwide</h1>
        </div>
        <div className="flex items-center space-x-3">
          <select className="border-none font-semibold rounded bg-black text-white">
            <option value="en">English</option>
            <option value="ar">العربية</option>
            <option value="fr">Français</option>
            <option value="it">Italiano</option>
          </select>
          <FaFacebook />
          <FaTwitter />
          <FaLinkedin />
          <FaInstagram />
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`w-full shadow-md bg-white ${isCartOpen ? "opacity-100" : ""}`}>
        
        <div className="flex justify-between items-center px-8 py-3">
          <img className="h-16 pl-20" src={bargainBase} alt="Logo" />

          
          <div className="flex items-center space-x-2 text-lg text-gray-600 pr-96">
            <FiSmartphone className="text-red-400 text-5xl font-semibold bg-white rounded p-2 shadow-sm" />
            <div>
              <p className="text-lg">Call Us</p>
              <p className="font-semibold text-stone-400">+91-234-567-8900</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center space-x-2">
            <div className="border rounded-sm w-44 border-stone-300 bg-gray-100 px-3 py-2">
              <select
                className="bg-transparent text-gray-600 focus:outline-none"
                onChange={(e) => onCategoryChange(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="jewelery">Jewelery</option>
                <option value="men's clothing">Men's Clothing</option>
                <option value="women's clothing">Women's Clothing</option>
              </select>
            </div>
            <div className="flex items-center border border-stone-300 rounded-sm bg-white w-64">
              <input
                type="text"
                placeholder="Enter Your Keyword"
                className="w-full px-3 py-2 focus:outline-none"
                onChange={(e) => onSearch(e.target.value)}
              />
              <button className="bg-orange-600 px-4 h-10 flex items-center justify-center">
                <VscSearch className="text-white text-lg" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className={`flex justify-between items-center px-24 py-3 z-50 shadow-md transition-all duration-300 ${isScrolled ? "fixed top-0 left-0 w-full bg-white shadow-lg" : "relative"}`}>
       
          <div className="flex space-x-6 text-gray-800">
            <Link to="/" className="text-blue-700">Home</Link>
            <Dropdown /> 
            <Link to="/contact" className="hover:text-blue-700">Contact</Link>
          </div>

        
          <div className="flex items-center space-x-6">
            <ProfileDropdown user={user} /> 
      

          
            <div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}>
              <FiShoppingCart className="text-4xl bg-white rounded p-2 shadow-sm mr-2 text-primary" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        decreaseQuantity={decreaseQuantity}
        addToCart={addToCart}
      />
    </div>
  );
};


Navbar.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  removeFromCart: PropTypes.func.isRequired,
  decreaseQuantity: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  user: PropTypes.object, 
  onSearch: PropTypes.func.isRequired, 
  onCategoryChange: PropTypes.func.isRequired, 
};

export default Navbar;