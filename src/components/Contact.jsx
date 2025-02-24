import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaClock } from 'react-icons/fa';
import { AiOutlineHome } from "react-icons/ai";

const Contact = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center text-sm text-gray-500">
                <Link to="/" className="flex items-center hover:text-gray-800">
                    <AiOutlineHome size={16} className="mr-1" /> Home
                </Link>
                <span className="mx-2">/</span>
                <span className="hover:text-gray-800">Pages</span>
                <span className="mx-2">/</span>
                <span className="text-orange-600">About Us</span>
            </div>
            <div className="grid md:grid-cols-2 gap-8 px-12">
                {/* Contact Form */}
                <form className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">We'd love to hear from you.</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="First Name" required className="border p-2 rounded" />
                        <input type="text" placeholder="Last Name" required className="border p-2 rounded" />
                    </div>
                    <div className="mt-4">
                        <input type="email" placeholder="Email Address" required className="border w-full p-2 rounded" />
                    </div>
                    <div className="mt-4">
                        <input type="tel" placeholder="Phone Number" required className="border w-full p-2 rounded" />
                    </div>
                    <div className="mt-4">
                        <textarea placeholder="Message" required className="border w-full p-2 rounded h-32"></textarea>
                    </div>
                    <button className="mt-4 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">
                        Send Message
                    </button>
                </form>

                {/* Contact Info */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">We Are Here To Help You</h2>
                    <div className="flex items-center gap-3 mb-4">
                        <FaMapMarkerAlt className="text-orange-500 text-xl" />
                        <p>423B, Road Worldwide Country, USA</p>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <FaEnvelope className="text-orange-500 text-xl" />
                        <p>themeht23@gmail.com</p>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <FaPhoneAlt className="text-orange-500 text-xl" />
                        <p>+91-234-567-8900</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <FaClock className="text-orange-500 text-xl" />
                        <p>Mon - Fri: 10AM - 7PM</p>
                    </div>
                </div>
            </div>

            {/* Google Map */}
            <div className="mt-8">
                <h2 className="text-2xl font-semibold text-center mb-4">Our Store Location</h2>
                <iframe
                    className="w-full h-64 rounded-lg"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.83543450862!2d144.95592831550426!3d-37.81720944202144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577da2c5a5a3f08!2sEnvato!5e0!3m2!1sen!2sus!4v1611816767735!5m2!1sen!2sus"
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>
        </div>
    );
};

export default Contact;
