import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  FaShoppingCart,
  FaFire,
  FaStar,
  FaChevronRight,
  FaSearch,
  FaTimes,
  FaExchangeAlt,
  FaChartLine,
  FaPercentage,
  FaStore,
} from "react-icons/fa";
import { FiSmartphone, FiShoppingBag, FiHome, FiHeart } from "react-icons/fi";
import { BsCheckCircleFill, BsGraphUp } from "react-icons/bs";
import { RiPriceTag3Line } from "react-icons/ri";

const Backup = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample data - replace with your API data
  useEffect(() => {
    setTimeout(() => {
      setTrendingProducts([
        {
          id: "1",
          name: "Sony WH-1000XM4 Wireless Headphones",
          brand: "Sony",
          image: "https://m.media-amazon.com/images/I/61vD7wQRvBL._SL1500_.jpg",
          price: "₹24,990",
          originalPrice: "₹29,990",
          stores: [
            {
              name: "Amazon",
              price: "₹24,990",
              logo: "https://logo.clearbit.com/amazon.in",
            },
            {
              name: "Flipkart",
              price: "₹25,499",
              logo: "https://logo.clearbit.com/flipkart.com",
            },
            {
              name: "Reliance Digital",
              price: "₹26,990",
              logo: "https://logo.clearbit.com/reliancedigital.in",
            },
          ],
          rating: 4.5,
          reviews: 1243,
        },
        {
          id: "2",
          name: "iPhone 13 Pro (128GB)",
          brand: "Apple",
          image: "https://m.media-amazon.com/images/I/61jLiCovxVL._SL1500_.jpg",
          price: "₹1,19,900",
          originalPrice: "₹1,29,900",
          stores: [
            {
              name: "Amazon",
              price: "₹1,19,900",
              logo: "https://logo.clearbit.com/amazon.in",
            },
            {
              name: "Flipkart",
              price: "₹1,18,999",
              logo: "https://logo.clearbit.com/flipkart.com",
            },
            {
              name: "Apple Store",
              price: "₹1,19,900",
              logo: "https://logo.clearbit.com/apple.com",
            },
          ],
          rating: 4.8,
          reviews: 3421,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const features = [
    {
      icon: <FaExchangeAlt className="text-2xl" />,
      title: "Compare Prices",
      description: "See prices across all major retailers",
      color: "text-blue-600 bg-blue-50",
    },
    {
      icon: <FaChartLine className="text-2xl" />,
      title: "Price History",
      description: "Track price trends over time",
      color: "text-purple-600 bg-purple-50",
    },
    {
      icon: <FaPercentage className="text-2xl" />,
      title: "Best Deals",
      description: "Find the biggest discounts",
      color: "text-green-600 bg-green-50",
    },
    {
      icon: <BsGraphUp className="text-2xl" />,
      title: "Price Alerts",
      description: "Get notified when prices drop",
      color: "text-orange-600 bg-orange-50",
    },
  ];

  const categories = [
    {
      name: "Electronics",
      icon: <FiSmartphone />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Fashion",
      icon: <FiShoppingBag />,
      color: "bg-pink-100 text-pink-600",
    },
    {
      name: "Home & Kitchen",
      icon: <FiHome />,
      color: "bg-green-100 text-green-600",
    },
    { name: "Appliances", icon: <FiHeart />, color: "bg-red-100 text-red-600" },
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Find the Best Prices Across Stores
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Compare prices, track deals, and save money on your favorite
                products
              </p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products to compare..."
                  className="w-full py-4 px-6 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button className="absolute right-2 top-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                  <FaSearch className="text-lg" />
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://illustrations.popsy.co/amber/digital-nomad.svg"
                alt="Price comparison"
                className="w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Use BargainBase?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl ${feature.color} bg-opacity-30 hover:shadow-md transition-all`}
              >
                <div
                  className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-8 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/category/${category.name
                  .toLowerCase()
                  .replace(" & ", "-")
                  .replace(" ", "-")}`}
                className={`${category.color} p-4 rounded-lg flex flex-col items-center hover:shadow-md transition-all`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <span className="font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Products */}
      <div className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold flex items-center">
              <FaFire className="text-orange-500 mr-2" />
              Trending Deals
            </h2>
            <Link
              to="/trending"
              className="text-blue-600 hover:underline flex items-center"
            >
              View all <FaChevronRight className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 shadow-sm animate-pulse h-96"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-2">
                      {product.brand}
                    </p>

                    <div className="flex items-center mb-3">
                      <div className="flex mr-2">
                        {renderStars(product.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline">
                        <span className="text-xl font-bold">
                          {product.price}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {product.originalPrice}
                        </span>
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          {Math.round(
                            1 -
                              parseInt(
                                (product.price.replace(/[^0-9]/g, "") /
                                  parseInt(
                                    product.originalPrice.replace(/[^0-9]/g, "")
                                  )) *
                                  100
                              )
                          )}
                          % OFF
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <FaStore className="mr-1" />
                        <span>{product.stores.length} stores</span>
                      </div>
                      <div className="text-blue-600 hover:underline">
                        Compare prices
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Price Comparison Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                  <p className="text-gray-600">{selectedProduct.brand}</p>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center mb-4">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="max-h-64 object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    {selectedProduct.stores.map((store, i) => (
                      <div
                        key={i}
                        className="w-16 h-16 bg-white border rounded-lg flex items-center justify-center p-2"
                      >
                        <img
                          src={store.logo}
                          alt={store.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">Best Price</h3>
                      <span className="text-xl font-bold text-blue-600">
                        {
                          selectedProduct.stores.reduce((min, store) =>
                            parseInt(store.price.replace(/[^0-9]/g, "")) <
                            parseInt(min.price.replace(/[^0-9]/g, ""))
                              ? store
                              : min
                          ).price
                        }
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Compared to {selectedProduct.originalPrice} (MSRP)
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3">
                      Available At:
                    </h3>
                    <div className="space-y-3">
                      {selectedProduct.stores.map((store, i) => (
                        <div
                          key={i}
                          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-white rounded-full border flex items-center justify-center mr-3">
                                <img
                                  src={store.logo}
                                  alt={store.name}
                                  className="w-8 h-8 object-contain"
                                />
                              </div>
                              <span className="font-medium">{store.name}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{store.price}</div>
                              <button className="text-sm text-blue-600 hover:underline mt-1">
                                View Deal
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <FaShoppingCart className="mr-2" /> Add to Cart
                    </button>
                    <button className="flex-1 bg-white border border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center">
                      <RiPriceTag3Line className="mr-2" /> Price Alert
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Backup;
