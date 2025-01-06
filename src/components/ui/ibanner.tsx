import React, { useState, useEffect } from "react";

export function BannerSection6() {
  const [bgColor, setBgColor] = useState("bg-blue-100");
  // const [textAnimation, setTextAnimation] = useState("opacity-0 translate-x-[-100px]");

  // useEffect(() => {
  //   // Trigger text slide-in animation on component mount
  //   const timer = setTimeout(() => setTextAnimation("opacity-100 translate-x-0"), 300);
  //   return () => clearTimeout(timer);
  // }, []);

  const handleColorChange = () => {
    const colors = ["bg-gray-200", "bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-red-200"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setBgColor(randomColor);
  };

  return (
    <section className="pt-10 container mx-auto">
      <div
        className={`shadow-sm px-4 py-1 flex flex-wrap items-center justify-between transition-all duration-500 ease-in-out rounded-lg ${bgColor}`}
      >
        <p
          className="text-sm text-blue-gray-200 transition-all duration-700 ease-in-out transform hover:animate-bounce"
          title="Welcome to Our Online Store!"
        >
          <span className="block">
            NEW | Discover the best deals at our Online Shopping Store! Shop now and find exclusive offers on your favorite products.
          </span>
        </p>

        <div className="flex items-center gap-4">
          <button
            className="px-2 py-1 text-xs font-medium text-blue-500 border border-blue-500 rounded hover:bg-blue-50 transition-transform duration-300 hover:scale-110 hover:rotate-3 hover:translate-y-1"
            onClick={() => console.log("Button clicked")}
          >
            Check out
          </button>

          <button
            className="p-1 text-sm text-gray-900 rounded-full transition-transform duration-300 hover:scale-110 hover:translate-y-1"
            onClick={() => console.log("Close clicked")}
          >
            X
          </button>

        </div>
      </div>
    </section>
  );
}

export default BannerSection6;
