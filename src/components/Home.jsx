import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart, FaEye } from "react-icons/fa";
import PropTypes from "prop-types";

const Home = ({ addToCart, searchQuery, selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        setProducts(response.data);
        setFilteredProducts(response.data); 
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

   
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  
  const openProductDetail = (product) => {
    setSelectedProduct(product);
  };

  
  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="flex items-center justify-center bg-gray-200 h-[200px] text-center relative">
        <div className="text-center max-w-xl">
          <p className="text-orange-500 font-semibold">Welcome to Ekocart</p>
          <h1 className="text-5xl font-bold text-gray-800">A New Online Shop Experience</h1>
        </div>
      </div>

      {/* Products Section */}
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Featured Products</h2>
        {loading ? (
          <p className="text-center">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="relative group border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
              
                <div
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => openProductDetail(product)}
                >
                  <FaEye className="text-gray-600 hover:text-orange-500" size={20} />
                </div>

                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-40 object-contain mb-3"
                />

                {/* Product Title */}
                <h3 className="text-lg font-semibold">{product.title}</h3>

                {/* Price and Add to Cart Button */}
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">${product.price}</p>
                  <button
                    className="bg-orange-500 p-2 rounded text-white flex items-end justify-end hover:bg-orange-600 transition-colors"
                    onClick={() => addToCart(product)}
                    aria-label="Add to cart"
                  >
                    <FaShoppingCart />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

     
      {selectedProduct && (
        <>
         
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={closeProductDetail}
          ></div>

          {/* Product Detail Card */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg z-50 w-11/12 max-w-4xl">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-64 h-64 object-contain"
                />
              </div>

              {/* Product Details */}
              <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-4">{selectedProduct.title}</h2>
                <p className="text-gray-600 mb-4">${selectedProduct.price}</p>
                <p className="text-gray-700 mb-4">{selectedProduct.description}</p>
                <div className="flex items-center gap-4">
                  <button
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    onClick={() => addToCart(selectedProduct)}
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