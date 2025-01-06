"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });
  const router = useRouter();

  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Fetch address suggestions when the user types in the address field
    if (id === "address" && value.length >= 3) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${value}`
        );

        if (!response.ok) {
          throw new Error("Error fetching address suggestions.");
        }

        const data = await response.json();
        const suggestions = data.map((item: any) => item.display_name);
        setAddressSuggestions(suggestions);
      } catch (error) {
        console.error("Error fetching address suggestions", error);
      }
    }
  };

  const handleAddressSelect = (selectedAddress: string) => {
    // Update the form data with the selected address
    setFormData((prev) => ({ ...prev, address: selectedAddress }));
    // Clear address suggestions after selection
    setAddressSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          address: formData.address,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        if (data.code === 200 && data.success === true) {
          toast.success("User Registered Successfully!");
          router.push("/login");
        } else {
          toast.error("This email is already registered");
        }
      } else {
        toast.error(`Error: ${data.message || "Registration failed."}`);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="w-full lg:grid lg:grid-cols-2 min-h-screen">
      <div className="flex items-center justify-center py-12">
        <form
          onSubmit={handleSubmit}
          className="mx-auto grid w-3/4 lg:w-1/2 gap-6, p-10"
        >
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign up</h1>
            <p className="text-muted-foreground">
              Provide Your Details to Create a New Account
            </p>
          </div>
          <div className="grid gap-4">
            {["name", "email", "password", "confirmPassword"].map((field) => (
              <div key={field} className="grid gap-2">
                <Label htmlFor={field}>
                  {field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </Label>
                <Input
                  id={field}
                  type={field.includes("password") ? "password" : "text"}
                  placeholder={`Enter ${field
                    .replace(/([A-Z])/g, " $1")
                    .toLowerCase()}`}
                  required
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                />
              </div>
            ))}
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <textarea
                id="address"
                placeholder="Enter your address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full h-20 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                aria-labelledby="address"
              />
              <div className="mt-2">
                {addressSuggestions.length > 0 && (
                  <ul className="list-none p-0">
                    {addressSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="cursor-pointer p-2 hover:bg-gray-200"
                        onClick={() => handleAddressSelect(suggestion)} // Address select handler
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full">
              Sign up
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </form>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/login.svg"
          alt="Background"
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
