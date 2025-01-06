"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Loader from "@/components/ui/loader";

export default function Headers() {
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("Authorization");
      if (user) {
        setIsLoggedIn(true);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem("Authorization");
    setIsLoggedIn(false);
    setLoading(false);
  };

  return (
    <header className="bg-black text-white shadow-md">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <Loader />
        </div>
      )}
      <div
        className="bg-gray-800 container mx-auto px-6 py-4 flex justify-between items-center"
        style={{ zIndex: 30, position: "fixed", width: "100%" }}
      >
        <Link href="/" className="text-2xl font-bold hover:text-blue-400">
          Mihir Store
        </Link>
        <nav className="space-x-4">
          <Link
            href="/viewOrder"
            className="text-white active:text-inherit hover:text-blue-400"
          >
            Order
          </Link>
          <Link
            href="/cart"
            className="text-white active:text-inherit hover:text-blue-400"
          >
            Cart
          </Link>
          <Link
            href="/profile"
            className="text-white  active:text-inherit hover:text-blue-400"
          >
            Profile
          </Link>

          {!isLoggedIn ? (
            <Link
              href="/login"
              className="text-white  active:text-inherit hover:text-blue-400"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="text-white  active:text-inherit hover:text-blue-400"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
