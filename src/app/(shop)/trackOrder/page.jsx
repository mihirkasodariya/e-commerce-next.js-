"use client";
import React, { useState, useEffect } from "react";

const TrackOrder = () => {
  const [trackingSteps, setTrackingSteps] = useState([
    {
      title: "Order Placed",
      description: "Your order has been confirmed and is being processed",
      icon: "fas fa-shopping-cart",
      completed: true,
      timestamp: new Date("2024-01-15T10:30:00"),
    },
    {
      title: "Processing",
      description: "Your order is being prepared for shipping",
      icon: "fas fa-box",
      completed: true,
      timestamp: new Date("2024-01-15T14:45:00"),
    },
    {
      title: "Shipped",
      description: "Your order has been shipped and is on its way",
      icon: "fas fa-shipping-fast",
      completed: true,
      timestamp: new Date("2024-01-16T09:15:00"),
    },
    {
      title: "Out for Delivery",
      description: "Your order is out for delivery in your area",
      icon: "fas fa-truck",
      completed: false,
      timestamp: new Date("2024-01-17T08:00:00"),
    },
    {
      title: "Delivered",
      description: "Your order has been delivered",
      icon: "fas fa-check-circle",
      completed: false,
      timestamp: new Date("2024-01-17T16:00:00"),
    },
  ]);

  const [formattedSteps, setFormattedSteps] = useState([]);
  const [formattedEstimatedDelivery, setFormattedEstimatedDelivery] =
    useState("");

  const estimatedDelivery = new Date("2024-01-17T16:00:00");

  useEffect(() => {
    const formatted = trackingSteps.map((step) => ({
      ...step,
      formattedTimestamp: step.timestamp.toLocaleString(),
    }));
    setFormattedSteps(formatted);

    setFormattedEstimatedDelivery(estimatedDelivery.toLocaleDateString());
  }, []);
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Track Your Order
        </h2>
        <div className="relative">
          <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200"></div>
          <div className="space-y-8">
            {formattedSteps.map((step, index) => (
              <div key={index} className="relative flex items-start">
                <div
                  className={`absolute left-0 rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-300 ${
                    step.completed
                      ? "bg-gradient-to-r from-green-500 to-blue-500"
                      : "bg-gray-200"
                  }`}
                >
                  <i className={`${step.icon} text-white text-xl`}></i>
                </div>
                <div className="ml-24">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{step.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {step.formattedTimestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            Estimated Delivery
          </h4>
          <p className="text-gray-600">{formattedEstimatedDelivery}</p>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
