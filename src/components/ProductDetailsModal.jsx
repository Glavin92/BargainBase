import React, { useState } from "react";
import {
  FaTimes,
  FaShoppingCart,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaChevronRight,
} from "react-icons/fa";

const ProductDetailsModal = ({
  selectedProduct,
  closeProductDetail,
  addToCart,
  contentRecommendations,
}) => {
  const [currentVariant, setCurrentVariant] = useState(
    selectedProduct?.currentVariant || null
  );

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

  // Calculate discount percentage
  const calculateDiscount = (price, originalPrice) => {
    if (!price || !originalPrice) return null;
    const priceNum = parseFloat(price.replace(/[^0-9.]/g, ""));
    const originalNum = parseFloat(originalPrice.replace(/[^0-9.]/g, ""));
    if (originalNum <= 0 || priceNum >= originalNum) return null;
    const discount = Math.round((1 - priceNum / originalNum) * 100);
    return discount >= 1 ? `${discount}% off` : null;
  };

  if (!selectedProduct) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={closeProductDetail}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <FaTimes size={24} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div className="sticky top-0">
            <div className="h-96 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              <img
                src={currentVariant?.thumbnail || selectedProduct.thumbnail}
                alt={selectedProduct.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex space-x-2 overflow-x-auto py-2">
              {selectedProduct.variants?.map((variant, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentVariant(variant)}
                  className={`flex-shrink-0 w-16 h-16 border rounded cursor-pointer hover:border-orange-500 ${
                    variant.thumbnail === currentVariant?.thumbnail
                      ? "border-orange-500"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={variant.thumbnail}
                    alt="Variant"
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
            <p className="text-gray-600 mb-4">Brand: {selectedProduct.brand}</p>

            {/* Rating */}
            <div className="flex items-center mb-4">
              {currentVariant?.rating ? (
                <>
                  <div className="flex mr-2">
                    {renderStars(currentVariant.rating)}
                  </div>
                  <span className="text-gray-500">
                    {currentVariant.rating} ({currentVariant.ratings_count || 0}{" "}
                    ratings)
                  </span>
                </>
              ) : (
                <span className="text-gray-500">Not Rated</span>
              )}
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-orange-500">
                  {currentVariant?.price || selectedProduct.price}
                </span>
                {currentVariant?.original_price && (
                  <span className="text-lg text-gray-500 line-through ml-2">
                    {currentVariant.original_price}
                  </span>
                )}
              </div>
              {currentVariant?.price && currentVariant?.original_price && (
                <span className="text-green-600 font-medium">
                  {calculateDiscount(
                    currentVariant.price,
                    currentVariant.original_price
                  )}
                </span>
              )}
            </div>

            {/* Variant Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-lg">Available Options:</h3>
              <div className="space-y-3">
                {selectedProduct.variants?.map((variant, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center p-3 border rounded-lg ${
                      variant.website === currentVariant?.website
                        ? "border-orange-300 bg-orange-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div>
                      <div className="font-medium">{variant.website}</div>
                      <div className="text-xl font-bold text-orange-500">
                        {variant.price}
                      </div>
                      {variant.original_price && (
                        <div className="text-sm text-gray-500 line-through">
                          {variant.original_price}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setCurrentVariant(variant);
                      }}
                      className="text-blue-600 text-sm font-medium flex items-center"
                    >
                      Select <FaChevronRight className="ml-1" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => {
                addToCart({
                  ...selectedProduct,
                  ...currentVariant,
                });
                closeProductDetail();
              }}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center justify-center"
            >
              <FaShoppingCart className="mr-2" />
              Add to Cart
            </button>

            {/* Content Recommendations */}
            {contentRecommendations.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold mb-4 text-lg">
                  You May Also Like
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {contentRecommendations.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        // You'll need to implement a function to open this product
                        // openProductDetail(item);
                      }}
                    >
                      <div className="h-24 bg-gray-100 rounded mb-2 flex items-center justify-center">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No image
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-medium line-clamp-2">
                        {item.name}
                      </div>
                      <div className="text-sm text-orange-500 mt-1">
                        {item.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
