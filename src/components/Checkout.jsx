import React, { useState } from 'react';
import PropTypes from 'prop-types';

// BillingDetails Component
const BillingDetails = ({ formData, handleChange }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-4 text-orange-600">Billing Details</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        name="firstName"
        placeholder="Your firstname"
        value={formData.firstName}
        onChange={handleChange}
        className="p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        required
      />
      <input
        type="text"
        name="lastName"
        placeholder="Your lastname"
        value={formData.lastName}
        onChange={handleChange}
        className="p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="E-mail Address"
        value={formData.email}
        onChange={handleChange}
        className="p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        required
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        className="p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        required
      />
      <input
        type="text"
        name="companyName"
        placeholder="Company Name"
        value={formData.companyName}
        onChange={handleChange}
        className="p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <select
        name="country"
        value={formData.country}
        onChange={handleChange}
        className="p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        required
      >
        <option value="">Select country</option>
        <option value="USA">United States</option>
        <option value="CA">Canada</option>
        <option value="IND">India</option>
        <option value="GER">Germany</option>
        <option value="FRA">France</option>
        <option value="AUS">Australia</option>
        <option value="ENG">England</option>
        <option value="JP">Japan</option>
        <option value="BRA">Brazil</option>
        <option value="CN">China</option>
      </select>
      <input
        type="text"
        name="address"
        placeholder="Enter Your Address"
        value={formData.address}
        onChange={handleChange}
        className="p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        required
      />
      <input
        type="text"
        name="secondAddress"
        placeholder="Second Address"
        value={formData.secondAddress}
        onChange={handleChange}
        className="p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <input
        type="text"
        name="townCity"
        placeholder="Town or City"
        value={formData.townCity}
        onChange={handleChange}
        className="p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        required
      />
      <input
        type="text"
        name="stateProvince"
        placeholder="State Province"
        value={formData.stateProvince}
        onChange={handleChange}
        className="p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        required
      />
      <input
        type="text"
        name="zipPostalCode"
        placeholder="Zip / Postal"
        value={formData.zipPostalCode}
        onChange={handleChange}
        className="p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        required
      />
    </div>
  </div>
);

// CouponSection Component
const CouponSection = ({ formData, handleChange, handleApplyCoupon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md mt-6">
    <div className="flex gap-4">
      <input
        type="text"
        name="couponCode"
        placeholder="Coupon Code"
        value={formData.couponCode}
        onChange={handleChange}
        className="flex-1 p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <button
        type="button"
        onClick={handleApplyCoupon}
        className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
      >
        Apply
      </button>
    </div>
  </div>
);

// OrderSummary Component
const OrderSummary = ({ cartItems, subtotal, shipping, total }) => (
  <div className="bg-white p-6 rounded-lg shadow-md mt-6">
    <h3 className="text-xl font-semibold mb-4 text-orange-600">Your Order</h3>
    {cartItems.map((item, index) => (
      <div key={index} className="flex justify-between py-2 border-b border-orange-200">
        <span>{item.quantity} x {item.name}</span>
        <span>${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    ))}
    <div className="flex justify-between py-2 border-b border-orange-200">
      <span>Shipping</span>
      <span>${shipping.toFixed(2)}</span>
    </div>
    <div className="flex justify-between py-2 border-b border-orange-200">
      <span>Subtotal</span>
      <span>${subtotal.toFixed(2)}</span>
    </div>
    <div className="flex justify-between py-2">
      <span className="font-semibold">Total :</span>
      <span className="font-semibold">${total.toFixed(2)}</span>
    </div>
  </div>
);

// PaymentMethod Component
const PaymentMethod = ({ formData, handleChange }) => (
  <div className="bg-white p-6 rounded-lg shadow-md mt-6">
    <h3 className="text-xl font-semibold mb-4 text-orange-600">Payment Method</h3>
    <label className="block mb-3">
      <input
        type="radio"
        name="paymentMethod"
        value="Direct Bank Transfer"
        checked={formData.paymentMethod === 'Direct Bank Transfer'}
        onChange={handleChange}
        className="mr-2 accent-orange-500"
      />
      Direct Bank Transfer
    </label>
    <label className="block mb-3">
      <input
        type="radio"
        name="paymentMethod"
        value="Check Payment"
        checked={formData.paymentMethod === 'Check Payment'}
        onChange={handleChange}
        className="mr-2 accent-orange-500"
      />
      Check Payment
    </label>
    <label className="block mb-3">
      <input
        type="radio"
        name="paymentMethod"
        value="Paypal Account"
        checked={formData.paymentMethod === 'Paypal Account'}
        onChange={handleChange}
        className="mr-2 accent-orange-500"
      />
      Paypal Account
    </label>
  </div>
);

// TermsAndConditions Component
const TermsAndConditions = ({ formData, handleChange }) => (
  <div className="bg-white p-6 rounded-lg shadow-md mt-6">
    <label className="flex items-center">
      <input
        type="checkbox"
        name="acceptTerms"
        checked={formData.acceptTerms}
        onChange={handleChange}
        className="mr-2 accent-orange-500"
        required
      />
      I have read and accept the terms and conditions
    </label>
  </div>
);

// Main Checkout Component
const Checkout = ({ cartItems }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    country: '',
    address: '',
    secondAddress: '',
    townCity: '',
    stateProvince: '',
    zipPostalCode: '',
    couponCode: '',
    paymentMethod: '',
    acceptTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleApplyCoupon = () => {
    console.log('Coupon Applied:', formData.couponCode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-orange-600">Product Checkout</h2>
      <form onSubmit={handleSubmit}>
        <BillingDetails formData={formData} handleChange={handleChange} />
        <CouponSection formData={formData} handleChange={handleChange} handleApplyCoupon={handleApplyCoupon} />
        <OrderSummary cartItems={cartItems} subtotal={subtotal} shipping={shipping} total={total} />
        <PaymentMethod formData={formData} handleChange={handleChange} />
        <TermsAndConditions formData={formData} handleChange={handleChange} />
        <button
          type="submit"
          className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg mt-6 hover:bg-orange-600 transition-colors"
        >
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

// Prop Validation for Checkout
Checkout.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Checkout;