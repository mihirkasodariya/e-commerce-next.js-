import React from "react";

const TermsPage = () => {
  const terms = [
    "This coupon applies to selected items only.",
    "Cannot be combined with other promotions or discounts.",
    "Valid for one-time use per customer.",
    "Expires on the date specified in the coupon details.",
    "Coupon cannot be exchanged for cash or gift cards.",
    "Misuse or unauthorized distribution of coupons may result in voiding the coupon.",
    "The company reserves the right to modify or terminate the coupon at any time.",
    "To redeem the coupon, add the qualifying item(s) to your cart and proceed to checkout.",
    "The coupon discount will be automatically applied at checkout, reducing the price of qualifying items.",
    "For Subscribe & Save coupons, the discount applies to the first delivery in the subscription.",
    "If you return an item purchased with a coupon, the discount will be subtracted from your refund.",
    "Mihir Clothing Store reserves the right to change or cancel any offer at any time.",
    "Not all customers are eligible for every offer."
  ];

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex justify-center items-center py-16 px-6">
      <div className="max-w-2xl bg-white shadow-xl rounded-lg border-t-4 border-orange-500 mt-14">
        <h1 className="text-4xl font-semibold text-gray-900 mb-8 text-center pt-6">
          Coupon Terms and Conditions
        </h1>
        <p className="mb-8 text-gray-600 text-lg text-center pl-6 pr-8">
          Before using the{" "}
          <span className="text-orange-500 font-semibold text-lg">1% discount coupon</span>,
          please read the following terms and conditions:
        </p>
        <ul className="list-decimal pl-8 space-y-3 text-lg text-gray-700 pr-8">
          {terms.map((term, index) => (
            <li key={index} className="hover:text-orange-600">{term}</li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-md">
            Have any questions?{" "}
            <span className="text-blue-500 font-semibold">Contact our support team</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
