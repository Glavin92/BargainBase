import axios from "axios";

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: "https://fakestoreapi.com", // API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to fetch products from the API
export const fetchProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data; // Return the products data
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array on error
  }
};

// Function to fetch a single product by ID
export const fetchProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
};

// Function to fetch categories
export const fetchCategories = async () => {
  try {
    const response = await api.get("/products/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Default export (Axios instance)
export default api;
