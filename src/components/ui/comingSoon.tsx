import React, { useState } from "react";
import { toast } from "react-hot-toast";
import "animate.css";  // Import animate.css for animations

export function ComingSoon1() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleEmailChange = () => setEmail(email);

  const handleNotifyClick = () => {
    if (email) {
      toast.success("Thank you for signing up!");
    } else {
      toast.error("Please enter a valid email!");
    }
  };

  return (
    <section className="grid mt-16 mb-24 w-full bg-cover bg-center bg-no-repeat bg-[url('/image/coming-soon-1.jpg')]">
      <div className="container mx-auto flex flex-col justify-center h-full text-center animate__animated animate__fadeIn">
        <div className="my-auto">
          <h2 className="text-3xl lg:text-4xl text-black font-bold animate__animated animate__fadeIn animate__delay-0.1s">
            Get Ready for Something Amazing!
          </h2>
          <p className="mt-4 mb-10 mx-auto text-gray-500 w-full lg:max-w-3xl animate__animated animate__fadeIn animate__delay-2s">
            We&apos;re excited to introduce our latest innovation that will
            change the way you develop. Stay tuned as we put the finishing
            touches on this game-changing product.
          </p>
          <p className="font-bold text-gray-500 mb-6 animate__animated animate__fadeIn animate__delay-3s">
            Sign up now to be the first to know when we launch
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center max-w-md mx-auto">
            {/* Input Field Animation */}
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300 animate__animated animate__slideInUp animate__delay-4s"
              value={email}
              onChange={handleEmailChange}
            />
            {/* Button Animation */}
            <button
              onClick={handleNotifyClick}
              className="w-full md:max-w-fit bg-red-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg transform transition-all duration-300 hover:bg-red-700 hover:scale-105 animate__animated animate__slideInUp animate__delay-5s"
            >
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ComingSoon1;
