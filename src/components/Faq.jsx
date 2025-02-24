import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { Link } from "react-router-dom";

const faqs = [
    {
        question: "What Are The Delivery Charges?",
        answer:
            "Looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cities of the word in classical literature, discovered many desktop publishing packages and web page editors now use.",
    },
    {
        question: "What Is The Estimated Delivery Time?",
        answer: "Looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cities of the word in classical literature, discovered many desktop publishing packages and web page editors now use.",
    },
    {
        question: "How To Track Order Work?",
        answer: "Looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cities of the word in classical literature, discovered many desktop publishing packages and web page editors now use.",
    },
    {
        question: "Will My Parcel Be Charged Customs And Import Charges?",
        answer: "Looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cities of the word in classical literature, discovered many desktop publishing packages and web page editors now use.",
    },
    {
        question: "Do You Ship Internationally?",
        answer: "Looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cities of the word in classical literature, discovered many desktop publishing packages and web page editors now use.",
    },
    {
        question: "Which Is The Same As Saying Through?",
        answer: "Looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cities of the word in classical literature, discovered many desktop publishing packages and web page editors now use.",
    },
];

const Faq = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center text-sm text-gray-500">
                <Link to="/" className="flex items-center hover:text-gray-800">
                    <AiOutlineHome size={16} className="mr-1" /> Home
                </Link>
                <span className="mx-2">/</span>
                <span className="hover:text-gray-800">Pages</span>
                <span className="mx-2">/</span>
                <span className="text-orange-600">About Us</span>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border border-gray-300 rounded-lg overflow-hidden"
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full flex justify-between items-center p-4 text-left bg-gray-100 hover:bg-gray-200"
                        >
                            <span className="font-semibold">{faq.question}</span>
                            {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        {openIndex === index && (
                            <div className="p-4 text-gray-600 bg-white">{faq.answer}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Faq;
