import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { FiCreditCard, FiTruck, FiClock, FiRefreshCw } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const Aboutus = () => {
    return (
        <div className="bg-gray-100">
            
            <div className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h1 className="text-4xl font-bold text-gray-900">About Us</h1>
                </div>
            </div>

            
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center text-sm text-gray-500">
                <Link to="/" className="flex items-center hover:text-gray-800">
                    <AiOutlineHome size={16} className="mr-1" /> Home
                </Link>
                <span className="mx-2">/</span>
                <span className="hover:text-gray-800">Pages</span>
                <span className="mx-2">/</span>
                <span className="text-orange-600">About Us</span>
            </div>

           
            <div className="max-w-6xl py-16">
                <div className="text-left flex">
                    <div className="min-w-3xl pl-32">
                        <h3 className="text-orange-500 font-semibold text-lg">— Why Choose Us</h3>
                        <h2 className="text-4xl font-bold text-gray-900 leading-snug mt-2">
                            We Are Known For Our Abilities <br /> Markets.
                        </h2>
                    </div>
                    <div className="min-w-xl">
                        <p className="text-gray-400 text-xl pt-14">
                            All types of businesses need access to development resources, so we
                            give you the option to decide how much you need to use.
                        </p>
                    </div>
                </div>
            </div>



            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[{ icon: <FiCreditCard />, title: "Credit Card" },
                { icon: <FiTruck />, title: "Free Shipping" },
                { icon: <FiClock />, title: "24/7 Support" },
                { icon: <FiRefreshCw />, title: "30 Days Returns" }
                ].map((feature, index) => (
                    <div key={index} className="p-6 border-md rounded-lg text-center bg-white shadow-md">
                        <div className="text-orange-500 text-4xl mb-3 flex justify-center">{feature.icon}</div>
                        <h3 className="text-lg font-semibold">{feature.title}</h3>
                        <p className="text-gray-500 text-sm mt-2">Serpiciatis unde omnis iste natus error sit.</p>
                    </div>
                ))}
            </div>

            
            <div className="max-w-6xl mx-auto px-6 py-16">
                <h3 className="text-orange-500 font-semibold text-lg text-center">— Testimonial</h3>
                <h2 className="text-4xl font-bold text-gray-900 text-center mt-2">Our Client Feedback</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    {[{ name: "Ember Lana", role: "Founder" },
                    { name: "Scott Jones", role: "Supervisor" },
                    { name: "Amber Holmes", role: "Manager" }
                    ].map((testimonial, index) => (
                        <div key={index} className="p-6 border-md rounded-lg text-center bg-white shadow-md">
                            <div className="flex justify-center mb-3 text-gray-400 text-6xl">
                                <FaUserCircle />
                            </div>
                            <p className="text-gray-500 text-sm">Ekocart Amazing E-commerce Template, clean code, Creative & Modern design.</p>
                            <h3 className="text-orange-600 font-semibold mt-3">{testimonial.name}</h3>
                            <p className="text-gray-500 text-sm">{testimonial.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Aboutus;
