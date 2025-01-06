"use client";

import { useState, useEffect } from "react";
import ProductsPage from "@/app/(shop)/products/page";
import Loader from "@/components/ui/loader";
import Ibanner from "@/components/ui/ibanner";
import ComingSoon from "@/components/ui/comingSoon";
const images = [
  {
    imgURL:
      "https://web.larue.com.kh/image/vcache/catalog/Men-Fashion-1920x550.webp",
    imgAlt: "img-1",
  },
  {
    imgURL:
      "https://brandsego.com/cdn/shop/collections/Screenshot_42_1600x.png?v=1696060836",
    imgAlt: "img-2",
  },
  {
    imgURL:
      "https://i.pinimg.com/originals/9a/71/6f/9a716f90fc2e24079b8960168d5ea089.jpg",
    imgAlt: "img-3",
  },
];

const CustomSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goPrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  useEffect(() => {
    const intervalId = setInterval(goNext, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative w-full overflow-hidden pt-2">
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
        <button onClick={goPrev} className="text-white text-3xl">
          &#10094;
        </button>
      </div>

      <div
        className="flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img
              src={image.imgURL}
              alt={image.imgAlt}
              className="w-full object-cover max-h-96"
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full bg-black border border-blue-600 transition-all duration-100 ease-in-out ${
                index === currentIndex ? "bg-white" : ""
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>

      <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
        <button onClick={goNext} className="text-white text-4xl">
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    setIsPageLoading(true);
    setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Loader */}
      {isPageLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      {/* Main content */}
      <main className="container mx-auto px-6 py-8">
        {!isPageLoading ? (
          <>
            <Ibanner />
            <CustomSlider />
            <ProductsPage />
            <ComingSoon />
          </>
        ) : (
          <div>Loading content...</div>
        )}
      </main>
    </div>
  );
}
