import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AboutUs from "./components/Aboutus";
import Footer from "./components/Footer";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import CartPage from "./components/CartPage";
import Checkout from "./components/Checkout";
import SearchPage from "./components/SearchPage";
import Backup from "./components/backup";
import { auth } from "./components/firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error parsing cart items from localStorage:", error);
      return [];
    }
  });

  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart items to localStorage:", error);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    // Create a unique identifier for the product using name, price, and website
    const productId = `${product.name}-${product.price.replace(/₹/g, "")}-${
      product.website
    }`;
    console.log(productId);

    const existingItem = cartItems.find(
      (item) =>
        item.name === product.name &&
        item.price === product.price.replace(/₹/g, "") &&
        item.website === product.website
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.name === product.name &&
          item.price === product.price.replace(/₹/g, "") &&
          item.website === product.website
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (product) => {
    setCartItems(
      cartItems.filter(
        (item) =>
          !(
            item.name === product.name &&
            item.price === product.price &&
            item.website === product.website
          )
      )
    );
  };

  const decreaseQuantity = (product) => {
    setCartItems(
      cartItems
        .map((item) =>
          item.name === product.name &&
          item.price === product.price &&
          item.website === product.website
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <Router>
      <Navbar
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        decreaseQuantity={decreaseQuantity}
        addToCart={addToCart}
        user={user}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              addToCart={addToCart}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
            />
          }
        />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/backup" element={<Backup />} />
        <Route
          path="/signin"
          element={user ? <Navigate to="/" /> : <SignIn />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <SignUp />}
        />
        <Route
          path="/search"
          element={
            <SearchPage
              addToCart={addToCart}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <CartPage
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              decreaseQuantity={decreaseQuantity}
              addToCart={addToCart}
            />
          }
        />
        <Route path="/checkout" element={<Checkout cartItems={cartItems} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
