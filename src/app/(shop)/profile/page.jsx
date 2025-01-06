"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/ui/loader"; // Import the new Loader component

export default function Profile() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false); // State for loading
  const [updating, setUpdating] = useState(false); // State for updating the profile

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true); // Set loading to true when fetching user data
      try {
        let token = localStorage.getItem("Authorization");
        if (!token) {
          router.push("/");
          console.error("No token found in localStorage");
          return;
        }

        const response = await fetch("http://localhost:3000/api/profile", {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.code === 200 && data.success === true) {
          setUserData({
            firstName: data.data.getUser.data.firstName,
            lastName: data.data.getUser.data.lastName,
            email: data.data.getUser.data.email,
            address: data.data.getUser.data.address,
          });
          // toast.success("Profile data fetched successfully!");
        } else {
          toast.error("Failed to fetch profile. Please try again!");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("An error occurred while fetching profile data.");
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true); // Set updating to true when submitting form
    try {
      let token = localStorage.getItem("Authorization");
      if (!token) {
        router.push("/");
        console.error("No token found in localStorage");
        return;
      }

      const response = await fetch("http://localhost:3000/api/profile", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          address: userData.address,
        }),
      });

      const data = await response.json();

      if (data.code === 200 && data.success === true) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile. Please try again!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating profile data.");
    } finally {
      setUpdating(false); // Set updating to false after submission
    }
  };

  return (
    <div className="flex items-center justify-center">
      <main className="pt-14 pb-4">
        <ToastContainer />
        {/* Full Page Loader */}
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
            <Loader color="#fff" loading={loading} size={50} /> {/* Updated loader */}
          </div>
        )}
        <section className="bg-white shadow-md rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
            Edit Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {["firstName", "lastName", "email", "address"].map((field) => (
              <div key={field} className="space-y-1">
                <label
                  htmlFor={field}
                  className="text-sm font-medium text-gray-700"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {field !== "address" ? (
                  <input
                    id={field}
                    type={field === "email" ? "email" : "text"}
                    placeholder={`Enter your ${field}`}
                    className="px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    value={userData[field]}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        [field]: e.target.value,
                      })
                    }
                  />
                ) : (
                  <textarea
                    id={field}
                    rows={3}
                    placeholder={`Enter your ${field}`}
                    className="px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    value={userData.address}
                    onChange={(e) =>
                      setUserData({ ...userData, address: e.target.value })
                    }
                  />
                )}
              </div>
            ))}
            <div className="text-center">
              <Button
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
                disabled={updating} // Disable button while updating
              >
                {updating ? (
                  <Loader color="#fff" loading={updating} size={20} /> // Updated loader
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
