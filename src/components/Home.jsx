import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaEye,
  FaFire,
  FaSpinner,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
} from "react-icons/fa";

const Home = ({ addToCart, searchQuery, selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const ITEMS_PER_PAGE = 12;

  // Fetch products from Flask backend
  const fetchProducts = async (query) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:5000/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query || searchQuery }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Process the products to add display properties
      const processedProducts = data.products.map((product) => ({
        ...product,
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
  };

  // When opening product details
  const openProductDetail = (product) => {
    // Set first variant as default if variants exist
    const firstVariant = product.variants?.[0] || {};
    const defaultProduct = {
      ...product,
      ...firstVariant, // This includes first variant's rating
      currentVariant: firstVariant, // Track current variant separately
      variants: product.variants || [], // Preserve all variants
    };

    setSelectedProduct(defaultProduct);
    document.body.style.overflow = "hidden";
  };

  // Close product details modal
  const closeProductDetail = () => {
    setSelectedProduct(null);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  // Trigger search when searchQuery changes
  useEffect(() => {
    if (searchQuery) {
      fetchProducts(searchQuery);
    }
  }, [searchQuery]);

  // Toggle variant visibility
  const toggleVariants = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  // Filter products by category
  const filteredAndPaginatedProducts = React.useMemo(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter((product) =>
        product.brand.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [products, selectedCategory, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render star rating
  const renderStars = (rating) => {
    if (!rating || rating === "Not Rated") return null;

    const stars = [];
    const numericRating = parseFloat(rating);
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-500 inline" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <FaStarHalfAlt key={i} className="text-yellow-500 inline" />
        );
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500 inline" />);
      }
    }

    return stars;
  };

  // When changing variants
  const handleVariantChange = (variant) => {
    setSelectedProduct((prev) => ({
      ...prev,
      ...variant,
      currentVariant: variant,
    }));
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 h-[300px] flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="text-center max-w-xl relative z-10">
          <p className="text-white font-semibold text-lg mb-4">
            Welcome to BargainBase
          </p>
          <h1 className="text-5xl font-bold text-white mb-6">
            Compare Prices Across Stores
          </h1>
          <p className="text-white text-lg">
            Find the best deals on your favorite products
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="p-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {searchQuery ? `Results for "${searchQuery}"` : "Featured Products"}
        </h2>

        {error && (
          <div className="text-center text-red-500 mb-4 bg-red-100 p-4 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-orange-500 text-4xl" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAndPaginatedProducts.map((product, index) => (
                <div
                  key={`${product.id || product.name}-${index}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="relative group">
                    {/* Website Badge */}
                    <span
                      className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded ${
                        product.available_on?.length > 1
                          ? "bg-purple-500"
                          : product.website?.includes("Amazon")
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      } text-white`}
                    >
                      {product.available_on?.join(" & ") || product.website}
                    </span>

                    {/* Product Image */}
                    <div
                      className="h-48 flex items-center justify-center bg-gray-100 cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain p-4"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-gray-500">No image available</div>
                      )}
                    </div>

                    <div className="p-4">
                      {/* Product Title */}
                      <h3
                        className="text-lg font-semibold mb-2 line-clamp-2 cursor-pointer hover:text-orange-500"
                        onClick={() => setSelectedProduct(product)}
                      >
                        {product.name}
                      </h3>

                      {/* Brand */}
                      <p className="text-sm text-gray-500 mb-2">
                        Brand: {product.brand}
                      </p>

                      {/* Price */}
                      <p className="text-xl font-bold text-orange-500 mb-2">
                        {product.price_display || product.price}
                      </p>

                      {/* View Details Button */}
                      <button
                        className="w-full mt-2 border border-orange-500 text-orange-500 p-2 rounded flex items-center justify-center hover:bg-orange-50 transition-colors"
                        onClick={() => openProductDetail(product)}
                      >
                        <FaEye className="mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded transition-colors ${
                        currentPage === page
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative p-6">
              <button
                onClick={() => closeProductDetail()}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={24} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div>
                  <div className="h-96 flex items-center justify-center bg-gray-100 mb-4 rounded-lg">
                    <img
                      src={
                        selectedProduct.thumbnail ||
                        "https://via.placeholder.com/400"
                      }
                      alt={selectedProduct.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Thumbnail Gallery */}
                  <div className="flex space-x-2 overflow-x-auto py-2">
                    {selectedProduct.variants?.map((variant, i) => (
                      <div
                        key={i}
                        className={`flex-shrink-0 w-16 h-16 border rounded cursor-pointer hover:border-orange-500 ${
                          variant.thumbnail === selectedProduct.thumbnail
                            ? "border-orange-500"
                            : "border-gray-200"
                        }`}
                        onClick={() => handleVariantChange(variant)}
                      >
                        <img
                          src={
                            variant.thumbnail ||
                            "https://via.placeholder.com/100"
                          }
                          alt="Variant"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Details */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Brand: {selectedProduct.brand}
                  </p>

                  {/* Current Variant Rating */}
                  <div className="flex items-center mb-2">
                    {selectedProduct.rating &&
                    selectedProduct.rating !== "Not Rated" ? (
                      <>
                        <div className="flex mr-1">
                          {renderStars(selectedProduct.rating)}
                        </div>
                        <span className="text-gray-500">
                          {selectedProduct.rating} (
                          {selectedProduct.ratings_count || 0} ratings)
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-500">Not Rated</span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-orange-500">
                      {selectedProduct.price_display || selectedProduct.price}
                    </span>
                    {selectedProduct.available_on?.length > 1 && (
                      <span className="ml-2 text-sm text-gray-500">
                        (across {selectedProduct.available_on.length} stores)
                      </span>
                    )}
                  </div>

                  {/* All Variants */}
                  <div className="mb-6 border-t pt-4">
                    <h3 className="font-semibold mb-3 text-lg">
                      Available Options:
                    </h3>
                    <ul className="space-y-3">
                      {selectedProduct.variants?.map((variant, i) => (
                        <li
                          key={i}
                          className={`flex justify-between items-center p-3 border rounded-lg ${
                            variant.price === selectedProduct.price
                              ? "border-orange-300 bg-orange-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div>
                            <div className="font-medium">{variant.website}</div>
                            <div className="text-xl font-bold text-orange-500">
                              {variant.price}
                            </div>
                            <div className="flex items-center mt-1">
                              {variant.rating &&
                              variant.rating !== "Not Rated" ? (
                                <>
                                  <div className="flex mr-1">
                                    {renderStars(variant.rating)}
                                  </div>
                                  <span className="text-gray-500 text-sm">
                                    {variant.rating} (
                                    {variant.ratings_count || 0} ratings)
                                  </span>
                                </>
                              ) : (
                                <span className="text-gray-500 text-sm">
                                  Not Rated
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              addToCart({ ...selectedProduct, ...variant });
                            }}
                            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                          >
                            <FaShoppingCart />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Product Description */}
                  <div className="mt-6 pt-4 border-t">
                    <h3 className="font-semibold mb-3 text-lg">
                      Product Details
                    </h3>
                    <div className="text-gray-600 space-y-2">
                      <p>
                        Compare prices across multiple stores to get the best
                        deal.
                      </p>
                      <p>All options are verified and updated regularly.</p>
                    </div>
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

export default Home;
