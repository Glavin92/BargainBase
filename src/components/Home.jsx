import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { FaShoppingCart, FaEye, FaStar, FaRegStar, FaSpinner, FaFire } from "react-icons/fa";
import PropTypes from "prop-types";

const ITEMS_PER_PAGE = 12;

const Home = ({ addToCart, searchQuery, selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recommendations, setRecommendations] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Memoize filtered products
  const filteredAndPaginatedProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter((product) => 
        product.brand.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [products, selectedCategory, currentPage]);

  // Fetch products when search query changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (!searchQuery) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:5000/api/search?query=${searchQuery}`);
        if (response.data.status === 'success') {
          setProducts(response.data.products);
          setTotalPages(Math.ceil(response.data.products.length / ITEMS_PER_PAGE));
          setCurrentPage(1);
        } else {
          setError('Failed to fetch products');
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError('Error connecting to the server');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  // Fetch recommendations when a product is selected
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (selectedProduct) {
        try {
          setLoadingRecommendations(true);
          const response = await axios.get(
            `http://localhost:5000/api/recommendations?product_name=${encodeURIComponent(selectedProduct.name)}`
          );
          if (response.data.status === 'success') {
            setRecommendations(response.data.recommendations);
          }
        } catch (error) {
          console.error("Error fetching recommendations:", error);
        } finally {
          setLoadingRecommendations(false);
        }
      }
    };

    fetchRecommendations();
  }, [selectedProduct]);

  // Fetch trending products
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/trending');
        if (response.data.status === 'success') {
          setTrendingProducts(response.data.trending);
        }
      } catch (error) {
        console.error("Error fetching trending products:", error);
      }
    };

    fetchTrending();
  }, []);

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    document.body.style.overflow = 'hidden';
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'auto';
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(parseFloat(rating) || 0);
    const hasHalfStar = (parseFloat(rating) || 0) % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }
    return stars;
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 h-[300px] flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="text-center max-w-xl relative z-10">
          <p className="text-white font-semibold text-lg mb-4">Welcome to BargainBase</p>
          <h1 className="text-5xl font-bold text-white mb-6">Compare Prices Across Stores</h1>
          <p className="text-white text-lg">Find the best deals on your favorite products</p>
        </div>
      </div>

      {/* Products Section */}
      <div className="p-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Featured Products</h2>
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
                  key={`${product.name}-${index}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="relative group">
                    <div
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                      onClick={() => openProductDetail(product)}
                    >
                      <FaEye className="text-gray-600 hover:text-orange-500" size={20} />
                    </div>

                    {/* Product Image */}
                    {product.thumbnail && (
                      <div className="h-48 flex items-center justify-center bg-gray-100">
                        <img 
                          src={product.thumbnail} 
                          alt={product.name}
                          className="max-h-full max-w-full object-contain p-4"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="p-4">
                      {/* Product Title */}
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>

                      {/* Brand */}
                      <p className="text-sm text-gray-500 mb-2">Brand: {product.brand}</p>

                      {/* Price */}
                      <p className="text-xl font-bold text-orange-500 mb-2">{product.price}</p>

                      {/* Rating */}
                      <div className="flex items-center mb-2">
                        <div className="flex mr-2">
                          {renderStars(product.rating)}
                        </div>
                        <span className="text-gray-500">({product.ratings} ratings)</span>
                      </div>

                      {/* Website */}
                      <p className="text-sm text-gray-500 mb-4">Available on: {product.website}</p>

                      {/* Add to Cart Button */}
                      <button
                        className="w-full bg-orange-500 p-2 rounded text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
                        onClick={() => addToCart(product)}
                        aria-label="Add to cart"
                      >
                        <FaShoppingCart className="mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded transition-colors ${
                      currentPage === page
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Trending Products Section */}
        {trendingProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-center mb-6">
              <FaFire className="text-orange-500 text-2xl mr-2" />
              <h2 className="text-3xl font-bold text-gray-800">Trending Now</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product, index) => (
                <div
                  key={`${product.name}-${index}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="relative group">
                    <div
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                      onClick={() => openProductDetail(product)}
                    >
                      <FaEye className="text-gray-600 hover:text-orange-500" size={20} />
                    </div>

                    {/* Product Image */}
                    {product.thumbnail && (
                      <div className="h-48 flex items-center justify-center bg-gray-100">
                        <img 
                          src={product.thumbnail} 
                          alt={product.name}
                          className="max-h-full max-w-full object-contain p-4"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="p-4">
                      {/* Product Title */}
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>

                      {/* Brand */}
                      <p className="text-sm text-gray-500 mb-2">Brand: {product.brand}</p>

                      {/* Price */}
                      <p className="text-xl font-bold text-orange-500 mb-2">{product.price}</p>

                      {/* Rating */}
                      <div className="flex items-center mb-2">
                        <div className="flex mr-2">
                          {renderStars(product.rating)}
                        </div>
                        <span className="text-gray-500">({product.ratings} ratings)</span>
                      </div>

                      {/* Website */}
                      <p className="text-sm text-gray-500 mb-4">Available on: {product.website}</p>

                      {/* Add to Cart Button */}
                      <button
                        className="w-full bg-orange-500 p-2 rounded text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
                        onClick={() => addToCart(product)}
                        aria-label="Add to cart"
                      >
                        <FaShoppingCart className="mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {selectedProduct && recommendations.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
              Similar Products
            </h2>
            {loadingRecommendations ? (
              <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-orange-500 text-4xl" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recommendations.map((product, index) => (
                  <div
                    key={`${product.name}-${index}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                  >
                    <div className="relative group">
                      <div
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                        onClick={() => openProductDetail(product)}
                      >
                        <FaEye className="text-gray-600 hover:text-orange-500" size={20} />
                      </div>

                      {/* Product Image */}
                      {product.thumbnail && (
                        <div className="h-48 flex items-center justify-center bg-gray-100">
                          <img 
                            src={product.thumbnail} 
                            alt={product.name}
                            className="max-h-full max-w-full object-contain p-4"
                            loading="lazy"
                          />
                        </div>
                      )}

                      <div className="p-4">
                        {/* Product Title */}
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>

                        {/* Brand */}
                        <p className="text-sm text-gray-500 mb-2">Brand: {product.brand}</p>

                        {/* Price */}
                        <p className="text-xl font-bold text-orange-500 mb-2">{product.price}</p>

                        {/* Rating */}
                        <div className="flex items-center mb-2">
                          <div className="flex mr-2">
                            {renderStars(product.rating)}
                          </div>
                          <span className="text-gray-500">({product.ratings} ratings)</span>
                        </div>

                        {/* Website */}
                        <p className="text-sm text-gray-500 mb-4">Available on: {product.website}</p>

                        {/* Add to Cart Button */}
                        <button
                          className="w-full bg-orange-500 p-2 rounded text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
                          onClick={() => addToCart(product)}
                          aria-label="Add to cart"
                        >
                          <FaShoppingCart className="mr-2" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={closeProductDetail}
          ></div>

          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-xl z-50 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Product Image */}
              {selectedProduct.thumbnail && (
                <div className="md:w-1/3 flex items-center justify-center bg-gray-100 rounded-lg p-4">
                  <img 
                    src={selectedProduct.thumbnail} 
                    alt={selectedProduct.name}
                    className="max-h-96 max-w-full object-contain"
                  />
                </div>
              )}
              
              <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>
                <p className="text-3xl font-bold text-orange-500 mb-4">{selectedProduct.price}</p>
                <p className="text-gray-500 mb-2">Brand: {selectedProduct.brand}</p>
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {renderStars(selectedProduct.rating)}
                  </div>
                  <span className="text-gray-500">({selectedProduct.ratings} ratings)</span>
                </div>
                <p className="text-gray-500 mb-4">Available on: {selectedProduct.website}</p>
                <div className="flex items-center gap-4">
                  <button
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    onClick={() => {
                      addToCart(selectedProduct);
                      closeProductDetail();
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    onClick={closeProductDetail}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

Home.propTypes = {
  addToCart: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  selectedCategory: PropTypes.string,
};

export default Home;