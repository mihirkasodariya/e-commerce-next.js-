"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/loader";

export default function OrderHistory() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("orders data ", orders);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("Authorization");
        if (!token) {
          router.push("/");
          setError("No token found in localStorage");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:3000/api/orderHistory", {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch order history");
        }

        const data = await response.json();
        console.log("Fetched data:", data);
        console.log("Order history", data);
        if (data.success && data.data?.orderHistory?.data) {
          const formattedOrders = data.data.orderHistory.data
            .map((order) => {
              if (!order.orders || order.orders.length === 0) return null;
              return {
                id: `# ${order.orderId}`,
                date: new Date(order.createdAt).toLocaleDateString(),
                address: order.address || "",
                items: order.orders.map((item) => ({
                  image: item.product?.image
                    ? `/uploads/${item.product.image[0]}`
                    : "/placeholder.jpg",
                  title: item.product?.name || "Unknown Product",
                  price: `₹${item.product?.price || 0}`,
                  quantity: item.quantity,
                  productId: item.product?.id || "",
                })),
                total: `₹${order.orders.reduce(
                  (sum, item) =>
                    sum + (item.product?.price || 0) * item.quantity,
                  0
                )}`,
                status: order.orders.every((item) => item.orderStatus === 3)
                  ? "Completed"
                  : "Pending",
                trackingNumber: order.trackingNumber || "N/A",
                trackingLink: order.trackingLink || "#",
                paymentType: order.paymentType || "N/A",
                carrier: order.carrier || "N/A",
                // pickupAddress: order.pickupAddress || "N/A",
                estimatedDeliveryDate:
                  order.estimatedDeliveryDate || "Not Available",
              };
            })
            .filter(Boolean);
          setOrders(formattedOrders);
        } else {
          throw new Error(data.message || "Unexpected API response structure");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24">
        <p className="text-xl font-semibold text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-12">
          Your Order History
        </h1>

        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-gray-100 rounded-lg shadow-sm mb-8 p-6 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-blue-700">
                  {order.id}
                </h2>
                <p className="text-sm text-gray-800">Placed on {order.date}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-800">
                  {order.total}
                </p>
                <p
                  className={`text-sm mt-2 ${
                    order.status === "Completed"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-4 bg-gray-50 rounded-lg transition-all duration-300"
                >
                  <div className="flex items-center">
                    <Link href={`/products/${item.productId}`}>
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="ml-3 mt-3 object-contain rounded-lg shadow-sm transition-all duration-300 transform hover:scale-105"
                      />
                    </Link>
                    <div className="ml-4">
                      <Link href={`/products/${item.productId}`}>
                        <h3 className="text-lg font-semibold text-gray-800 hover:text-indigo-600">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500">
                        Price: {item.price}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Order Summary */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <i className="fas fa-credit-card text-indigo-600"></i>
                    <p className="ml-3 text-lg font-semibold text-gray-900">
                      Payment Type
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {order.paymentType === 1
                      ? "Paypal"
                      : order.paymentType === 2
                      ? "Credit/Debit Card"
                      : "N/A"}
                  </p>
                </div>

                <div className=" bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <i className="fas fa-shipping-fast text-indigo-600"></i>
                    <p className="ml-3 text-lg font-semibold text-gray-900">
                      Shipping Carrier
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{order.carrier}</p>
                </div>
              </div>

              {/* Tracking Information and Estimated Delivery */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Estimated Delivery */}

                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <p className="text-lg font-semibold text-gray-900 pl-2 pb-1">
                    Pickup Address
                  </p>
                  <p className="text-sm text-gray-600 mr-6">{"N/A"}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <p className="text-lg font-semibold text-gray-900 pl-2 pb-1">
                    Delivery Address
                  </p>
                  <p className="text-sm text-gray-600 mr-6">
                    {orders[0].address}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <p className="text-lg font-semibold text-gray-900 pl-2 pb-1">
                    Estimated Delivery
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.estimatedDeliveryDate}
                  </p>
                </div>
                {/* Tracking Number */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-gray-900 pl-2">
                      Tracking Number
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {order.trackingNumber}
                  </p>
                  {/* <div className=" "> */}
                  <a
                    href={order.trackingLink}
                    className="pl-[360px] text-sm text-indigo-600 hover:text-indigo-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button
                      className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-all"
                      onClick={() => router.push("/trackOrder")}
                    >
                      Track Order
                    </button>
                  </a>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className=" flex justify-center">
          <button
            onClick={() => router.push("/")}
            className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg animate-pulse hover:bg-gray-300"
          >
            {" "}
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
