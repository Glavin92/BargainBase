import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import bargainBase from "../assets/bargainBase.png";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaStore,
  FaTruck,
  FaRegUser,
  FaChevronDown,
} from "react-icons/fa";
import { FiSmartphone, FiShoppingCart } from "react-icons/fi";
import { VscSearch } from "react-icons/vsc";
import CartSidebar from "./CartSidebar";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import debounce from "lodash/debounce";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative group">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="flex items-center hover:text-orange-600 transition-colors"
      >
        Pages <FaChevronDown className="ml-1 text-xs" />
      </button>
      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="py-1">
            <Link
              to="/about"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/faq"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              FAQ
            </Link>
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
    <div className="relative group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:text-orange-600 focus:outline-none"
      >
        <FaRegUser className="text-xl text-gray-700 hover:text-orange-600 transition-colors" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {user ? (
              <button
                onClick={() => signOut(auth)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

ProfileDropdown.propTypes = {
  user: PropTypes.object,
};

const Navbar = ({
  cartItems,
  removeFromCart,
  decreaseQuantity,
  addToCart,
  user,
  onSearch,
  onCategoryChange,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();

  // Debounced search function
  const debouncedSearch = debounce((query) => {
    if (query.trim()) {
      onSearch(query.trim());
      if (!searchHistory.includes(query)) {
        setSearchHistory((prev) => [query, ...prev].slice(0, 5));
      }
    }
  }, 1000);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchInputClick = () => {
    navigate("/search");
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      if (!searchHistory.includes(searchQuery)) {
        setSearchHistory((prev) => [searchQuery, ...prev].slice(0, 5));
      }
      onSearch(searchQuery.trim()); // Call the search callback if needed
    } else {
      navigate("/search"); // Navigate even if empty query
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogoClick = () => {
    e.preventDefault(); // Prevent default link behavior
    setSearchQuery(""); // Clear the search query
    onSearch(""); // Clear any active search results
    navigate("/"); // Navigate to home
  };

  return (
    <div className="sticky top-0 z-50">
      {/* Top Banner */}
      <div className="bg-orange-600 text-white text-sm font-medium flex justify-center px-4 py-2 space-x-6">
        <div className="flex items-center space-x-2">
          <FaStore />
          <span>Welcome to BargainBase</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaTruck />
          <span>Free Shipping Worldwide</span>
        </div>
        <div className="hidden md:flex items-center space-x-4 ml-6">
          <a href="#" className="hover:text-orange-200 transition-colors">
            <FaFacebook />
          </a>
          <a href="#" className="hover:text-orange-200 transition-colors">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-orange-200 transition-colors">
            <FaLinkedin />
          </a>
          <a href="#" className="hover:text-orange-200 transition-colors">
            <FaInstagram />
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`w-full bg-white shadow-sm ${
          isCartOpen ? "opacity-100" : ""
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
          <Link to="/" onClick={handleLogoClick} className="mb-4 md:mb-0">
            <img className="h-16" src={bargainBase} alt="BargainBase Logo" />
          </Link>

          {/* Search Bar */}
          <div className="w-full md:w-1/2 lg:w-1/3 relative mb-4 md:mb-0">
            <div className="flex items-center border-2 border-orange-500 rounded-lg overflow-hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                onClick={handleSearchInputClick}
                placeholder="Search for products..."
                className="w-full px-4 py-2.5 focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="bg-orange-600 px-4 h-12 flex items-center justify-center hover:bg-orange-700 transition-colors"
              >
                <VscSearch className="text-white text-xl" />
              </button>
            </div>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white shadow-lg rounded-b-lg z-50">
                {searchHistory.map((query, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSearchQuery(query);
                      onSearch(query);
                    }}
                    className="px-4 py-2 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    {query}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User and Cart */}
          <div className="flex items-center space-x-6">
            <ProfileDropdown user={user} />
            <div
              className="relative cursor-pointer"
              onClick={() => setIsCartOpen(true)}
            >
              <FiShoppingCart className="text-2xl text-gray-700 hover:text-orange-600 transition-colors" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div
          className={`w-full h-10 border-t border-gray-100 ${
            isScrolled
              ? "fixed top-31 left-0 right-0 bg-white shadow-md z-40"
              : "relative"
          }`}
        >
          <div className="container mx-auto">
            <div className="flex justify-center space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Home
              </Link>
              <Dropdown />
              <Link
                to="/contact"
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Contact
              </Link>
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
