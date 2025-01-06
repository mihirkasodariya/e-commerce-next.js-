"use client"; // Mark this as a client-side component

import { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const cookieAccepted = localStorage.getItem('cookieAccepted');
    if (cookieAccepted) {
      setIsVisible(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setIsVisible(false);
    alert('Cookies accepted!');
  };

  const handleReject = () => {
    localStorage.setItem('cookieAccepted', 'false');
    setIsVisible(false);
    alert('Cookies rejected!');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-12 right-2 transform translate-x-0 bg-black shadow-xl rounded-xl p-8 w-96 z-50 max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-lg text-white">We Use Cookies</span>
        {/* <button onClick={() => setIsVisible(false)} className="text-white hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button> */}
      </div>
      <p className="text-gray-500 text-sm mb-6">
        By clicking "Accept", you agree to our use of cookies to personalize content and collect analytics for an improved browsing experience.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={handleReject}
          className="bg-white w-28 text-sm text-black hover:text-white hover:bg-gradient-to-r hover:from-red-400 hover:to-yellow-500 px-4 py-2 border border-white rounded-md transition-all duration-500 transform hover:scale-110 hover:rotate-2 hover:shadow-lg"
        >
          Reject
        </button>

        <button
          onClick={handleAccept}
          className="w-28 text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-purple-600 hover:to-pink-600 px-4 py-2 rounded-md transition-all duration-500 transform hover:scale-110 hover:rotate-2 hover:shadow-lg"
        >
          Accept
        </button>

      </div>
    </div>
  );
};

export default CookieConsent;
