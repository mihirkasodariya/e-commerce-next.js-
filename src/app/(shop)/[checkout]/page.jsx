"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const itemsParam = searchParams.get("items");
  const items = itemsParam ? JSON.parse(itemsParam) : [];
  console.log("items", items);
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    mobile: "",
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const orderId = generateOrderId();
  const saveBuyProduct = async (e) => {
    try {
      let token = localStorage.getItem("Authorization");
      if (!token) {
        router.push("/");
        console.error("No token found in localStorage");
        return;
      }

      const orderData = {
        name: formData.fullName,
        orderId: orderId,
        order: items.map((item) => ({
          productId: item.id,
          quantity: parseInt(item.quantity) || 1,
          orderStatus: 1,
        })),
        address: formData.address,
        mobile: formData.mobile,
        email: formData.email,
        paymentType: paymentMethod === "paypal" ? 1 : 2,
      };
      console.log("orderData", orderData);
      const response = await fetch("http://localhost:3000/api/createOrder", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (data?.code == 200 && data?.success == true) {
        console.log("Order placed successfully");
        toast.success(data?.message);
        return data.code || 200;
      } else {
        toast.error(data?.message || "Failed to place the order");
        return data.code || 403;
      }
    } catch (error) {
      toast.error("An error occurred while placing the order.");
    }
  };
  // items.push({ orderId: orderId.toString() });

  function generateOrderId() {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    return timestamp + randomNum;
  }

  function formatExpiryDate(event) {
    let value = event.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setFormData({ ...formData, expiryDate: value });
  }

  // const CompletePaymentButton = ({ isFormValid, items, saveBuyProduct }) => {
  const handlePaymentClick = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please fill in all required fields!");
      return;
    }
    const response = await saveBuyProduct();
    console.log("jsdj", response);
    try {
      if (response === 200) {
        // const encodedItems = encodeURIComponent(JSON.stringify(items));
        // const updatedItems = [...items, { orderId: orderId }];

        const encodedItems = encodeURIComponent(JSON.stringify(items));
        const encodedOrderId = encodeURIComponent(
          JSON.stringify([{ orderId: orderId }])
        );

        router.push(`/summary?items=${encodedItems}&orderId=${encodedOrderId}`);

        // router.push(`/summary?items=${encodedItems}?orderId=${encodedOrderId}`);
      } else {
        toast.error("Failed to complete the payment. Please try again.");
      }
    } catch (e) {
      toast.error("An error occurred during the payment process.");
    }
  };
  // };
  useEffect(() => {
    const isValid =
      formData.fullName &&
      formData.email &&
      formData.address &&
      (paymentMethod === "paypal" ||
        (formData.cardHolderName &&
          formData.cardNumber &&
          formData.expiryDate &&
          formData.cvv));
    setIsFormValid(isValid);
  }, [formData, paymentMethod]);

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * parseInt(item.quantity),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white rounded-lg shadow-lg overflow-hidden mt-16">
        {/* Billing Details */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Billing Details
          </h2>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                *Full Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                placeholder="Enter Fullname"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                *Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                *Mobile Number
              </label>
              <input
                type="number"
                id="mobile"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                placeholder="Enter your mobile number"
                value={formData.mobile}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 10) {
                    setFormData({ ...formData, mobile: value });
                  }
                }}
                maxLength={10}
                required
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                *Address
              </label>
              <input
                type="text"
                id="address"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                placeholder="Enter your address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Payment Method
              </label>
              <div className="flex items-center space-x-4 mb-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <span className="text-sm text-gray-600">
                    Credit/Debit Card
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                  />
                  <span className="text-sm text-gray-600">PayPal</span>
                </label>
              </div>

              {/* {paymentMethod === "card" && ( */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="card-holder-name"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    *Cardholder's Name
                  </label>
                  <input
                    type="text"
                    id="card-holder-name"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                    placeholder="Enter Holder Name"
                    value={formData.cardHolderName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cardHolderName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="card-number"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    *Card Number
                  </label>
                  <input
                    type="number"
                    id="card-number"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                    placeholder="Enter Card Number"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cardNumber: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="expiry-date"
                      className="block text-sm font-medium text-gray-600 mb-1"
                    >
                      *Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiry-date"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={formData.expiryDate}
                      onChange={formatExpiryDate}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cvv"
                      className="block text-sm font-medium text-gray-600 mb-1"
                    >
                      *CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                      placeholder="123"
                      maxLength="3"
                      value={formData.cvv}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cvv: e.target.value.replace(/\D/g, "").slice(0, 3),
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
              {/* )} */}
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow-lg rounded-xl p-2 max-w-lg mx-auto">
          <h2 className="m-6 text-2xl font-bold text-gray-900 mb-6">
            Order Summary
          </h2>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 m-[20px] p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow"
              >
                {/* Image Section */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />

                {/* Details Section */}
                <div className="flex flex-col flex-grow space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="line-clamp-2 text-lg font-medium text-gray-800">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    <span className="truncate">Quantity: {item.quantity}</span>
                  </div>
                  <div className="text-gray-900 font-bold">
                    ₹ {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="flex justify-between items-center text-lg font-semibold text-gray-900 mt-8 border-t pt-6">
              <span>Total</span>
              <span className="text-xl text-primary font-semibold">
                ₹ {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="pl-32 p-8">
            <button
              className={`w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out ${
                !isFormValid && "opacity-50 cursor-not-allowed"
              }`}
              onClick={handlePaymentClick}
              // onClick={async (e) => {
              //   e.preventDefault();

              //   if (!isFormValid) {
              //     toast.error("Please fill in all required fields!");
              //     return;
              //   }
              //   const response = await saveBuyProduct();

              //   console.log(response);
              //   const encodedItems = encodeURIComponent(JSON.stringify(items));
              //   router.push(`/summary?items=${encodedItems}`);
              // }}
            >
              Complete Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
