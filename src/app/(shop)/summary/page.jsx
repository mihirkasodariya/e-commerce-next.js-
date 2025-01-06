"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessful() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsParam = searchParams.get("items");
  const orderIdParam = searchParams.get("orderId");
  const orderId = orderIdParam ? JSON.parse(orderIdParam) : [];
  const items = itemsParam ? JSON.parse(itemsParam) : [];

  const orderData = {
    orderId: "#" + orderId[0].orderId,
    paymentDate: "18th March 2021",
    paymentMethod: "Credit Card ending with 8822",
    products: items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
      status: "ready for delivery",
      expectedDelivery: "23rd March 2021",
      subtotal: item.price * item.quantity,
    })),
  };

  const totalAmount = orderData.products.reduce(
    (acc, product) => acc + product.subtotal,
    0
  );

  return (
    <section className="py-16 bg-gradient-to-t from-white">
      <div className="max-w-6xl mx-auto px-6 mt-16">
        <div className="bg-white shadow-2xl rounded-3xl p-12 mb-16">
          <div className="p-6 rounded-lg shadow-xl text-center animate-fade-in banner-bg-gradient">
            <h2 className="text-4xl font-semibold animate-text-change">
              Payment Successful
            </h2>
            <p className="mt-4 text-lg text-gray-600 animate-text-change">
              Your order has been confirmed! Thank you for shopping with us.
            </p>
          </div>

          <div className="mt-12 flex justify-between items-center border-b pb-6">
            <div>
              <p className="font-semibold text-lg text-gray-800">
                Order ID:{" "}
                <span className="text-indigo-600">{orderData.orderId}</span>
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Payment Date:{" "}
                <span className="text-gray-400">{orderData.paymentDate}</span>
              </p>
            </div>
            <button
              className="bg-blue-600 text-white py-2 px-6 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-95 hover:animate-bounce"
              onClick={() => router.push("/trackOrder")}
            >
              Track Your Order
            </button>
          </div>

          <div className="mt-10 space-y-8">
            {orderData.products.map((product, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row bg-gray-50 rounded-xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl"
              >
                <div className="w-48 h-48 rounded-md overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={180}
                    height={180}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="flex-grow pb-8 ml-6">
                  <h3 className="text-sm font-medium text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Qty: {product.quantity}
                  </p>
                  <div className="flex items-center space-x-4">
                    <p className="text-sm text-gray-600">
                      Price: ₹ {product.price}
                    </p>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <div>
                      <p
                        className={` inline-block text-sm font-medium py-1 text-center rounded-full w-auto p-3 ${
                          product.status === "Ready for Delivery"
                            ? "bg-emerald-100 text-emerald-600 w-auto"
                            : "bg-indigo-100 text-indigo-600 w-full"
                        }`}
                      >
                        {product.status}
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        Expected Delivery: {product.expectedDelivery}
                      </p>
                    </div>
                    <div className="mt-8">
                      <p className="text-sm text-gray-800">
                        ₹ {(product.price * product.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Compact Total Price Box */}
          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-100 to-indigo-200 border-2 border-indigo-600 rounded-xl shadow-lg">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xl font-semibold text-gray-800">Subtotal</p>
                <p className="text-xl font-semibold text-gray-900">
                  ₹ {totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xl font-semibold text-gray-800">
                  Total Price
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  ₹ {totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
              <p className="text-lg font-semibold text-gray-800">Paid using:</p>
              <p className="text-lg text-gray-700">{orderData.paymentMethod}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <button
            className="bg-blue-600 text-white py-2 px-6 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-95 animate-pulse"
            onClick={() => router.push("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Add CSS styles for the animations */}
      <style jsx>{`
        @keyframes bannerColorChange {
          0% {
            color: #000000;
          }
          50% {
            color: #733b73;
          }
          100% {
            color: #023020;
          }
        }

        .animate-text-change {
          animation: bannerColorChange 3s infinite;
        }

        .banner-bg-gradient {
          background: linear-gradient(#4bb543, #4a90e2, #f39c12);
          animation: bannerColorChange 3s infinite;
        }
      `}</style>
    </section>
  );
}
