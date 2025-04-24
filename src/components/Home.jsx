import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "../api/Axios";
import { getAuth } from "firebase/auth";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  FaShoppingCart,
  FaFire,
  FaStar,
  FaChevronRight,
  FaBolt,
  FaSpinner,
  FaRegStar,
  FaStarHalfAlt,
  FaSearch,
  FaTimes,
  FaExchangeAlt,
  FaChartLine,
  FaPercentage,
  FaStore,
} from "react-icons/fa";
import { FiSmartphone, FiShoppingBag, FiHome, FiHeart } from "react-icons/fi";
import { BsCheckCircleFill, BsGraphUp } from "react-icons/bs";

const Home = ({ addToCart, searchQuery, selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [contentRecommendations, setContentRecommendations] = useState([]);
  const ITEMS_PER_PAGE = 12;

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

  // Parse variants string to array
  const parseVariants = (variantsString) => {
    try {
      if (typeof variantsString === "string") {
        return JSON.parse(variantsString.replace(/'/g, '"'));
      }
      return variantsString || [];
    } catch (error) {
      console.error("Error parsing variants:", error);
      return [];
    }
  };

  // Memoized utility functions
  const calculateDiscountPercentage = useCallback((price, originalPrice) => {
    const extractNumber = (str) =>
      parseFloat(str?.toString().replace(/[^0-9.]/g, "")) || 0;
    const currentPrice = extractNumber(price);
    const original = extractNumber(originalPrice);

    if (!original || original <= 0 || currentPrice >= original) return null;
    const discount = Math.round((1 - currentPrice / original) * 100);
    return discount >= 1 ? `${discount}% off` : null;
  }, []);

  const renderStars = useCallback((rating) => {
    if (!rating || rating === "Not Rated") return null;

    const numericRating =
      typeof rating === "string" ? parseFloat(rating) : rating;
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;

    return [...Array(5)].map((_, i) => {
      if (i < fullStars)
        return <FaStar key={i} className="text-yellow-500 inline" />;
      if (i === fullStars && hasHalfStar)
        return <FaStarHalfAlt key={i} className="text-yellow-500 inline" />;
      return <FaRegStar key={i} className="text-yellow-500 inline" />;
    });
  }, []);

  // API calls
  const fetchProducts = useCallback(
    async (query) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:5000/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: query || searchQuery }),
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        const processedProducts = data.products.map((product) => ({
          ...product,
          variants: parseVariants(product.variants),
          showVariants: false,
        }));

        setProducts(processedProducts);
        setTotalPages(Math.ceil(processedProducts.length / ITEMS_PER_PAGE));
        setCurrentPage(1);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [searchQuery]
  );

  const fetchProductDetails = useCallback(async (variantLinks) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/product_details",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ links: variantLinks }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch variant details");
      return await response.json();
    } catch (error) {
      console.error("Error fetching variant details:", error);
      return null;
    }
  }, []);

  const fetchRecommendations = useCallback(async (searchResults) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user ? user.uid : "guest_user";

      const response = await axios.post(
        "http://localhost:5000/api/recommendations/collaborative",
        {
          user_id: userId,
          product_id: null,
          top_n: 10,
          search_results: searchResults,
        }
      );

      const recommendedProducts = Array.isArray(response?.data)
        ? response.data.map((product) => ({
            ...product,
            variants: parseVariants(product.variants),
          }))
        : [];

      setRecommendations(recommendedProducts);
      setProducts(
        recommendedProducts.map((product) => ({
          ...product,
          showVariants: false,
        }))
      );
      setTotalPages(Math.ceil(recommendedProducts.length / ITEMS_PER_PAGE));
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendations([]);
      setProducts([]);
    }
  }, []);

  const fetchContentRecommendations = useCallback(
    async (productId, searchResults) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/recommendations/content",
          {
            product_id: productId,
            top_n: 5,
            search_results: searchResults,
          }
        );
        setContentRecommendations(response.data || []);
      } catch (error) {
        console.error("Error fetching content-based recommendations:", error);
        setContentRecommendations([]);
      }
    },
    []
  );

  // Product handlers
  const openProductDetail = useCallback(
    async (product) => {
      try {
        setLoading(true);
        const variantLinks = product.variants?.map((v) => v.link) || [];
        const variantDetails = await fetchProductDetails(variantLinks);

        const updatedVariants =
          product.variants?.map((variant, index) => ({
            ...variant,
            ...(variantDetails?.results[index] || {}),
          })) || [];

        const defaultProduct = {
          ...product,
          ...(updatedVariants[0] || {}),
          currentVariant: updatedVariants[0] || {},
          variants: updatedVariants,
        };

        setSelectedProduct(defaultProduct);
        fetchContentRecommendations(product.id, products);
        document.body.style.overflow = "hidden";
      } catch (error) {
        console.error("Error opening product details:", error);
        setSelectedProduct({
          ...product,
          currentVariant: product.variants?.[0] || {},
          variants: product.variants || [],
        });
        document.body.style.overflow = "hidden";
      } finally {
        setLoading(false);
      }
    },
    [fetchContentRecommendations, fetchProductDetails, products]
  );

  const closeProductDetail = useCallback(() => {
    setSelectedProduct(null);
    document.body.style.overflow = "auto";
  }, []);

  const handleVariantChange = useCallback((variant) => {
    setSelectedProduct((prev) => ({
      ...prev,
      ...variant,
      currentVariant: variant,
    }));
  }, []);

  // Effects
  useEffect(() => {
    if (searchQuery) {
      fetchProducts(searchQuery).then(() => {
        if (products.length > 0) {
          fetchRecommendations(products);
        }
      });
    }
  }, [searchQuery, fetchProducts, products, fetchRecommendations]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const userId = user ? user.uid : "guest_user";

        const response = await axios.post(
          "http://localhost:5000/api/recommendations/collaborative",
          {
            user_id: userId,
            product_id: null,
            top_n: 10,
            search_results: [],
          }
        );

        const recommendedProducts = Array.isArray(response?.data)
          ? response.data.map((product) => ({
              ...product,
              variants: parseVariants(product.variants),
            }))
          : [];

        setRecommendations(recommendedProducts);
        setProducts(
          recommendedProducts.map((product) => ({
            ...product,
            showVariants: false,
          }))
        );
        setTotalPages(Math.ceil(recommendedProducts.length / ITEMS_PER_PAGE));
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecommendations([]);
        setProducts([]);
      }
    };

    fetchInitialData();
  }, []);

  // Memoized filtered products
  const filteredAndPaginatedProducts = React.useMemo(() => {
    let filtered = products;
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) =>
          product.brand
            ?.toLowerCase()
            .includes(selectedCategory.toLowerCase()) ||
          product.category
            ?.toLowerCase()
            .includes(selectedCategory.toLowerCase())
      );
    }
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [products, selectedCategory, currentPage]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen pt-16">
      {/* Hero Carousel */}
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

      {/* Deals of the Day */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <FaFire className="text-orange-500 mr-2" /> Deals of the Day
            </h2>
            <Link
              to="/search?sort=discount"
              className="text-blue-600 text-sm font-medium flex items-center"
            >
              View All <FaChevronRight className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {loading
              ? Array(4)
                  .fill()
                  .map((_, i) => (
                    <div
                      key={i}
                      className="border rounded-lg p-3 animate-pulse"
                    >
                      <div className="h-32 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))
              : recommendations
                  .map((item) => ({ item, sort: Math.random() }))
                  .sort((a, b) => a.sort - b.sort)
                  .map(({ item }) => item)
                  .slice(0, 4)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => openProductDetail(item)}
                    >
                      <div className="h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-gray-400">Product Image</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {item.name}
                      </div>
                      <div className="mt-1">
                        <span className="text-sm font-bold">
                          {item.price_display}
                        </span>
                        {item.variants?.[0]?.original_price && (
                          <span className="text-xs text-gray-500 line-through ml-1">
                            {item.variants[0].original_price}
                          </span>
                        )}
                      </div>
                      {calculateDiscountPercentage(
                        item.price_display,
                        item.variants?.[0]?.original_price
                      ) && (
                        <div className="text-xs text-green-600 mt-1">
                          {calculateDiscountPercentage(
                            item.price_display,
                            item.variants?.[0]?.original_price
                          )}
                        </div>
                      )}
                    </div>
                  ))}
          </div>
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-xl font-bold mb-4">Recommended For You</h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-orange-500 text-4xl" />
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recommendations.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openProductDetail(item)}
                >
                  <div className="h-40 bg-gray-100 rounded mb-2 flex items-center justify-center">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-gray-400">Product Image</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {item.name}
                  </div>
                  <div className="mt-1">
                    <span className="text-sm font-bold">
                      {item.price_display}
                    </span>
                    {item.variants?.[0]?.original_price && (
                      <span className="text-xs text-gray-500 line-through ml-1">
                        {item.variants[0].original_price}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="text-yellow-400 text-xs flex">
                      {item.avg_rating && item.avg_rating !== "Not Rated"
                        ? [...Array(5)].map((_, i) =>
                            i < Math.floor(parseFloat(item.avg_rating)) ? (
                              <FaStar key={i} className="fill-current" />
                            ) : (
                              <FaStar key={i} className="text-gray-300" />
                            )
                          )
                        : null}
                    </div>
                    {item.ratings_count !== "0" && (
                      <span className="text-xs text-gray-500 ml-1">
                        ({item.ratings_count || 0})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No recommendations available. Start shopping to get personalized
              recommendations!
            </p>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="relative p-8">
              <button
                onClick={closeProductDetail}
                className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes size={24} />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Product Images */}
                <div className="sticky top-0">
                  <div className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center p-8 mb-4">
                    <img
                      src={
                        selectedProduct.currentVariant?.thumbnail ||
                        selectedProduct.thumbnail ||
                        "https://via.placeholder.com/600"
                      }
                      alt={selectedProduct.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Thumbnail Gallery */}
                  {selectedProduct.variants?.length > 1 && (
                    <div className="flex space-x-3 overflow-x-auto py-2 px-1">
                      {selectedProduct.variants.map((variant, i) => (
                        <button
                          key={i}
                          onClick={() => handleVariantChange(variant)}
                          className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden transition-all ${
                            variant.thumbnail ===
                            selectedProduct.currentVariant?.thumbnail
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={
                              variant.thumbnail ||
                              "https://via.placeholder.com/200"
                            }
                            alt="Variant"
                            className="w-full h-full object-contain bg-white"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div>
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedProduct.name || "Product Name Not Available"}
                    </h2>
                    <p className="text-lg text-gray-600">
                      Brand:{" "}
                      <span className="font-medium">
                        {selectedProduct.brand || "Not Specified"}
                      </span>
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-6">
                    {selectedProduct.currentVariant?.rating &&
                    selectedProduct.currentVariant.rating !== "Not Rated" ? (
                      <div className="flex items-center bg-blue-50 rounded-full px-4 py-1">
                        <div className="flex mr-2 text-yellow-400">
                          {renderStars(selectedProduct.currentVariant.rating)}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {selectedProduct.currentVariant.rating} (
                          {selectedProduct.currentVariant.ratings_count || 0})
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Not Rated</span>
                    )}
                  </div>

                  {/* Price Section */}
                  <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                    <div className="flex items-baseline mb-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {selectedProduct.currentVariant?.price_display ||
                          selectedProduct.price_display ||
                          "N/A"}
                      </span>
                      {selectedProduct.currentVariant?.original_price && (
                        <>
                          <span className="ml-3 text-xl text-gray-500 line-through">
                            {selectedProduct.currentVariant.original_price}
                          </span>
                          {calculateDiscountPercentage(
                            selectedProduct.currentVariant?.price_display,
                            selectedProduct.currentVariant?.original_price
                          ) && (
                            <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                              {calculateDiscountPercentage(
                                selectedProduct.currentVariant?.price_display,
                                selectedProduct.currentVariant?.original_price
                              )}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <div className="text-green-600 text-sm font-medium flex items-center">
                      <BsCheckCircleFill className="mr-1" /> In Stock
                    </div>
                  </div>

                  {/* Store Options */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FaStore className="mr-2 text-blue-500" />
                      Available At:
                    </h3>
                    <div className="space-y-3">
                      {selectedProduct.variants?.map((variant, i) => (
                        <div
                          key={i}
                          className={`flex justify-between items-center p-4 rounded-lg border transition-colors ${
                            variant.website ===
                            selectedProduct.currentVariant?.website
                              ? "border-blue-300 bg-blue-50"
                              : "border-gray-200 hover:border-blue-200"
                          }`}
                        >
                          <div>
                            <div className="font-medium text-gray-900">
                              {variant.website || "Unknown Store"}
                            </div>
                            <div className="flex items-baseline mt-1">
                              <span className="text-xl font-bold text-gray-900">
                                {variant.price_display ||
                                  variant.price ||
                                  "N/A"}
                              </span>
                              {variant.original_price && (
                                <span className="ml-2 text-sm text-gray-500 line-through">
                                  {variant.original_price}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                addToCart({ ...selectedProduct, ...variant })
                              }
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                            >
                              <FaShoppingCart className="mr-2" /> Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product Description */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-3">
                      Product Details
                    </h3>
                    <div className="text-gray-600 space-y-3">
                      <p>
                        Compare prices across multiple stores to get the best
                        deal. All options are verified and updated regularly.
                      </p>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {/* Recommendations Section - Horizontal Carousel */}
                  {contentRecommendations.length > 0 && (
                    <div className="lg:col-span-2">
                      <h3 className="text-xl font-semibold mb-4">
                        Similar Products
                      </h3>
                      <div className="relative">
                        <Swiper
                          slidesPerView={2}
                          spaceBetween={16}
                          breakpoints={{
                            640: {
                              slidesPerView: 3,
                            },
                            1024: {
                              slidesPerView: 4,
                            },
                          }}
                          navigation
                          modules={[Navigation]}
                          className="px-2 py-4"
                        >
                          {contentRecommendations.map((item) => (
                            <SwiperSlide key={item.id}>
                              <div
                                className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer h-full"
                                onClick={() => openProductDetail(item)}
                              >
                                <div className="aspect-square bg-gray-50 rounded-md flex items-center justify-center mb-2">
                                  <img
                                    src={
                                      item.thumbnail ||
                                      "https://via.placeholder.com/300"
                                    }
                                    alt={item.name}
                                    className="max-h-full max-w-full object-contain"
                                  />
                                </div>
                                <h4 className="font-medium text-sm line-clamp-2">
                                  {item.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {item.brand}
                                </p>
                                <p className="text-sm font-bold mt-1">
                                  {item.price_display}
                                </p>
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Recommendation Sections */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Trending in Electronics</h2>
            <Link
              to="/search?category=electronics"
              className="text-blue-600 text-sm font-medium flex items-center"
            >
              View All <FaChevronRight className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {loading
              ? Array(5)
                  .fill()
                  .map((_, i) => (
                    <div
                      key={i}
                      className="border rounded-lg p-3 animate-pulse"
                    >
                      <div className="h-40 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))
              : recommendations
                  .filter((item) => item.category === "electronics")
                  .slice(0, 5)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => openProductDetail(item)}
                    >
                      <div className="h-40 bg-gray-100 rounded mb-2 flex items-center justify-center">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-gray-400">Product Image</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {item.name}
                      </div>
                      <div className="mt-1">
                        <span className="text-sm font-bold">
                          {item.price_display}
                        </span>
                      </div>
                    </div>
                  ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
