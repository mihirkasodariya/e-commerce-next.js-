"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
export default function ShoppingCart() {
  const router = useRouter();
  const pathname = usePathname();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("cartItems", cartItems);
  const isAuthenticated = true;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const getCartList = async () => {
      setLoading(true);
      try {
        let token = localStorage.getItem("Authorization");
        if (!token) {
          router.push("/");
          console.log("No token found in localStorage");
          return;
        }

        const response = await fetch("http://localhost:3000/api/cart", {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (data.code === 200 && data.success === true) {
          const formattedCartItems = data.data.data.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            price: parseFloat(item.product.price),
            mrp: parseFloat(item.product.price) * 2,
            discount: 50,
            quantity: item.quantity,
            image: `/uploads/${item.product.image[0]}`,
          }));
          setCartItems(formattedCartItems);
          // toast.success("Cart List fetched successfully!");
        } else {
          toast.error("Failed to fetch cart list. Please try again!");
        }
      } catch (error) {
        console.log("Error fetching cart list:", error);
        toast.error("An error occurred while fetching cart data.");
      } finally {
        setLoading(false);
      }
    };
    getCartList();
  }, []);

  const updateCartItem = async (productId, quantity) => {
    try {
      let token = localStorage.getItem("Authorization");
      if (!token) {
        router.push("/");
        console.log("No token found in localStorage");
        return;
      }

      const response = await fetch("http://localhost:3000/api/cart", {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await response.json();

      console.log("response", response);
      if (data.code === 200 && data.success === true) {
        toast.success("Cart item updated successfully!");
      } else {
        toast.error("Failed to update cart item. Please try again!");
      }
    } catch (error) {
      console.log("Error updating cart item:", error);
      toast.error("An error occurred while updating cart item.");
    }
  };

  const handleQuantityChange = (index, value) => {
    const updatedCartItems = [...cartItems];
    const item = updatedCartItems[index];
    const newQuantity = item.quantity + value;

    if (newQuantity <= 0) {
      updatedCartItems.splice(index, 1);
    } else {
      updatedCartItems[index].quantity = newQuantity;
    }

    setCartItems(updatedCartItems);
    updateCartItem(item.id, newQuantity);
  };

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const calculateSavings = () =>
    cartItems.reduce(
      (total, item) => total + (item.mrp - item.price) * item.quantity,
      0
    );

  // const pushCheckOut = async () => {
  //   setLoading(true);
  //   try {
  //     const data = { key: "Test Product Key" };
  //     router.push(`/checkout?key=${encodeURIComponent("test")}`);

  //     console.log("pathname:", pathname);
  //     // router.push(
  //     //   "/checkout",
  //     //   {
  //     //     query: { state: data },
  //     //   },
  //     //   undefined,
  //     //   { shallow: false, state: data }
  //     // );
  //   } catch (error) {
  //     console.error("Error during checkout:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container px-4 py-16">
        {cartItems.length === 0 ? (
          <div className="text-center bg-gray-100 p-16">
            <img
              src="https://m.media-amazon.com/images/G/31/cart/empty/kettle-desaturated._CB424694257_.svg"
              alt="Empty Cart"
              className="mx-auto mb-6 w-48 h-48"
            />
            <h2 className="text-2xl font-semibold text-gray-800">
              Your Cart is empty!
            </h2>
            <p className="text-gray-600 mt-4">Shop today’s deals</p>
            <div className="mt-6 space-x-4">
              <button
                onClick={() => router.push("/login")}
                className="inline-block bg-black text-white py-2 px-4 rounded hover:bg-black"
              >
                Sign in to your account
              </button>
              <button
                onClick={() => router.push("/register")}
                className="inline-block border border-blue-500 text-blue-500 py-2 px-4 rounded hover:bg-blue-100"
              >
                Sign up now
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-8">
              The price and availability of items are subject to change. The
              shopping cart is a temporary place to store a list of your items
              and reflects each item's most recent price.
            </p>
          </div>
        ) : (
          <div>
            <div className="space-y-6 mt-16 ml-96 mr-96">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-6 bg-white p-4 rounded-lg shadow-md"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                      {item.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <p className="text-green-500 font-semibold">
                        ₹{item.price.toFixed(2)}
                      </p>
                      <p className="line-through text-gray-500">
                        ₹{item.mrp.toFixed(2)}
                      </p>
                      <p className="text-red-500 text-sm">
                        {item.discount}% off
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <button
                        onClick={() => handleQuantityChange(index, -1)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        -
                      </button>
                      <span className="text-gray-800 font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(index, 1)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-800 font-semibold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mt-8 ml-96 mr-96">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Subtotal
                </h3>
                <p className="text-gray-800 font-bold text-xl">
                  ₹{calculateTotal().toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <h3 className="text-sm text-gray-600">You Save</h3>
                <p className="text-green-600 font-semibold">
                  ₹{calculateSavings().toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-16 ml-96 mr-96">
              <button
                onClick={() => router.push("/")}
                className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300"
              >
                Continue Shopping
              </button>
              {/* <button
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                onClick={() => pushCheckOut()}
              >
                Proceed to Checkout
              </button> */}
              {cartItems.map((item, index) => (
                <div key={index}>
                  {/* {item.name} - ₹{item.price.toFixed(2)} */}
                </div>
              ))}

              <Link
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                href={{
                  pathname: "/checkout",
                  query: {
                    items: JSON.stringify(
                      cartItems.map((item) => ({
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        image: item.image,
                        id: item.id,
                      }))
                    ),
                  },
                }}
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
