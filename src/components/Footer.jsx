import React from "react";
import { FaFacebookF, FaDribbble, FaInstagram, FaTwitter, FaLinkedin, FaMapMarkerAlt, FaEnvelope, FaPhone, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-green-950 text-white py-8 px-4 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-4xl font-semibold text-white">Eko<span className="text-red-500">cart</span></h2>
          <p className="text-md mt-2">
            Ekocart - Multipurpose eCommerce HTML5 Template is fully responsive.
            Build whatever you like with the Ekocart template.
          </p>
          <div className="flex space-x-4 mt-4 text-3xl">
            <FaFacebookF />
            <FaDribbble />
            <FaInstagram />
            <FaTwitter />
            <FaLinkedin />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg">Quick Links</h3>
          <ul className="mt-2 space-y-2">
            <li><Link to="/" className="hover:text-yellow-700">Home</Link></li>
            <li>About</li>
            <li>Shop</li>
            <li>Faq</li>
            <li>Blogs</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg">Top Products</h3>
          <ul className="mt-2 space-y-2">
            <li>T-Shirts</li>
            <li>Sneakers & Athletic</li>
            <li>Shirts & Tops</li>
            <li>Sunglasses</li>
            <li>Bags & Wallets</li>
            <li>Accessories</li>
            <li>Shoes</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg">Contact</h3>
          <p className="mt-2 flex items-center"><FaMapMarkerAlt className="mr-2" /> 423B, Road Worldwide Country, USA</p>
          <p className="flex items-center"><FaEnvelope className="mr-2" /> themeht23@gmail.com</p>
          <p className="flex items-center"><FaPhone className="mr-2" /> +91-234-567-8900</p>
          <p className="flex items-center"><FaClock className="mr-2" /> Mon - Fri: 10AM - 7PM</p>
        </div>
      </div>
      <div className="mt-8 text-center border-t border-gray-700 pt-4">
        <p>Copyright &copy; 2020 All rights reserved | This template is made by ThemeHt</p>
      </div>
    </footer>
  );
};

export default Footer;
