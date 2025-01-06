"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Loader from "@/components/ui/loader";

import {
  FaUndo,
  FaMoneyBillWave,
  FaShippingFast,
  FaCheckCircle,
} from "react-icons/fa";

export default function ProductDetailPage() {
  const router = useRouter();

  const [isPageLoading, setIsPageLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(null);

  const params = useParams();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [quantity, setQuantity] = useState(1);
  console.log("product", product);
  console.log("quantity", quantity);
  useEffect(() => {
    const fetchProduct = async () => {
      setIsPageLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/admin/product?productId=${productId}`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          const { data: productData } = await response.json();
          if (productData?.image?.length) {
            setProduct(productData);
            setSelectedImage(productData.image[0]);
          }
        } else {
          toast.error("Failed to fetch product data");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
        setIsPageLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/admin/getProduct"
        );
        if (response.ok) {
          const { data } = await response.json();
          setSuggestions(data.data);
        } else {
          console.error("Failed to fetch suggestions");
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    fetchSuggestions();
  }, []);

  const handleAddToCart = async (product) => {
    setLoadingProduct(product.id); // Show loader for the specific product
    try {
      let token = localStorage.getItem("Authorization");
      if (!token) {
        router.push("/");
        toast.error("You need to log in to add items to your cart.");
        return;
      }

      const response = await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Product added to cart successfully!");
      } else {
        toast.error(data.message || "Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("An error occurred while adding the product to your cart.");
    } finally {
      setLoadingProduct(null);
    }
  };

  const handleBuyNow = async (product) => {
    setLoadingProduct(product.id);
    try {
      router.push("/checkout");
    } catch (error) {
      console.error("Error buying product:", error);
    } finally {
      setLoadingProduct(null);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  if (loading || isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-8 py-24">
        <section className="flex flex-col lg:flex-row justify-between gap-12">
          <div>
            <div
              className="overflow-hidden rounded-lg shadow-md mb-12 relative h-[600px]"
              style={{ width: "550px" }}
            >
              <Image
                src={`/uploads/${selectedImage}`}
                alt="Product Image"
                fill
                className=" w-full h-full cursor-pointer"
                priority
              />
            </div>

            <div className="mt-4 flex gap-4">
              {product.image.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className="relative w-24 h-40 border border-gray-300 p-1 rounded-md cursor-pointer hover:border-blue-600"
                >
                  <Image
                    src={`/uploads/${img}`}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2">
            <h1 className="text-2xl font-bold text-gray-800 mr-12">
              {product.name}
            </h1>

            <p className="text-2xl font-semibold text-black-600 mt-4">
              ₹ {product.price}
            </p>
            {/* Quantity Selector  my-6 ml-24*/}
            <div className="flex items-center justify-around gap-6 mt-4 ml-6 w-32 h-10 p-4 bg-white border border-gray-200 rounded-2xl">
              <button
                className=" text-white w-10 h-10 rounded-full flex items-center justify-center text-lg"
                onClick={handleDecreaseQuantity}
              >
                <span className="text-black text-2xl ">-</span>
              </button>
              <span className="text-2xl font-extrabold text-gray-900">
                {quantity}
              </span>
              <button
                className=" text-white w-10 h-10 rounded-full flex items-center justify-center text-lg"
                onClick={handleIncreaseQuantity}
              >
                <span className="text-black text-2xl "> +</span>
              </button>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-2">
              <div className="bg-orange-500 text-black px-2 rounded-e-2xl font-bold inline-block">
                Coupon
              </div>
              <input
                type="checkbox"
                id="apply-coupon"
                className="form-checkbox text-teal-500"
              />
              <label htmlFor="apply-coupon" className="text-gray-700">
                Apply 1% coupon
              </label>
              <a href="/terms" className="text-teal-500 underline">
                Terms
              </a>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/2 text-center flex items-center justify-center"
                type="button"
                onClick={() => handleAddToCart(product)}
                disabled={loadingProduct === product.id} // Disable button while loading
              >
                {loadingProduct === product.id ? "Adding..." : "Add to Cart"}
              </button>

              {/* <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-1/2 text-center flex items-center justify-center"
                type="button"
                onClick={() => FainalBuyNow(product)}
              >
                Buy Now
              </button> */}
              <Link
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-1/2 text-center flex items-center justify-center"
                href={{
                  pathname: "/checkout",
                  query: {
                    items: JSON.stringify([
                      {
                        id: product.id,
                        name: product.name,
                        quantity: quantity.toString(),
                        price: product.price,
                        image: `/uploads/${product.image[0]}`,
                      },
                    ]),
                  },
                }}
              >
                Buy Now
              </Link>
            </div>

            <div className="text-sm text-gray-500 mt-2">
              <p className="ml-6">
                <span className="font-semibold text-green-500">In Stock</span> |
                FREE delivery on your first order.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-semibold text-black-800 mb-2">
                Offers
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">
                    Partner Offers
                  </h4>
                  <p className="text-sm text-gray-600">
                    Buy 2 or more and get 5% off on Quantity.
                  </p>
                  <a
                    href="#"
                    className="text-blue-600 text-sm font-medium mt-2 inline-block hover:underline"
                  >
                    2 offers &gt;
                  </a>
                </div>

                <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">
                    Bank Offer
                  </h4>
                  <p className="text-sm text-gray-600">
                    Upto ₹2,000.00 discount on select cards.
                  </p>
                  <a
                    href="#"
                    className="text-blue-600 text-sm font-medium mt-2 inline-block hover:underline"
                  >
                    5 offers &gt;
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-16 mb-4 mt-6 rounded-lg shadow-lg bg-white p-6">
              <div className="flex flex-col items-center gap-2 text-sm text-gray-600">
                <a href="/return">
                  <FaUndo className="text-blue-600 text-3xl" />
                </a>
                <span className="font-semibold">10 Days Return</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-sm text-gray-600">
                <a href="/payment-policy">
                  <FaMoneyBillWave className="text-yellow-500 text-3xl" />
                </a>
                <span className="font-semibold">Pay on Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-sm text-gray-600">
                <a href="/delivery-policy">
                  <FaShippingFast className="text-green-500 text-3xl" />
                </a>
                <span className="font-semibold">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-sm text-gray-600">
                <a href="/security-policy">
                  <FaCheckCircle className="text-purple-600 text-3xl" />
                </a>
                <span className="font-semibold">Secure Transaction</span>
              </div>
            </div>

            <ul className="list-disc pl-6 text-gray-700 mt-6 mr-12">
              {product.points.map((point, idx) => (
                <li key={idx} className="text-base pt-2">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Product Description
          </h2>
          <p className="text-lg text-gray-700">{product.description}</p>
        </section>

        <section className="mt-16">
          <div className=" mx-auto mt-8">
            <div className="flex items-center mb-4">
              <div className="text-xl font-semibold">Customer reviews</div>
              <div className="ml-4 flex items-center">
                <span className="text-yellow-500 text-2xl">★★★★☆</span>
                <span className="ml-2 text-gray-600">(4.3 out of 5)</span>
              </div>
            </div>
            <div className="col">
              <div className="mb-4">
                <div className="text-sm text-gray-500">
                  13,763 global ratings
                </div>
                <div className="row mt-2">
                  <div className="flex items-center mr-2">
                    <span className="text-yellow-500">★★★★★</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full relative">
                      <div className="w-3/5 h-full bg-yellow-500 absolute"></div>
                    </div>
                    <span className="ml-2">59%</span>
                  </div>
                  <div className="flex items-center mr-2">
                    <span className="text-yellow-500">★★★★</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full relative">
                      <div className="w-1/4 h-full bg-yellow-500 absolute"></div>
                    </div>
                    <span className="ml-2">25%</span>
                  </div>
                  <div className="flex items-center mr-2">
                    <span className="text-yellow-500">★★★</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full relative">
                      <div className="w-1/10 h-full bg-yellow-500 absolute"></div>
                    </div>
                    <span className="ml-2">9%</span>
                  </div>
                  <div className="flex items-center mr-2">
                    <span className="text-yellow-500">★★</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full relative">
                      <div className="w-1/20 h-full bg-yellow-500 absolute"></div>
                    </div>
                    <span className="ml-2">5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            You May Also Like
          </h2>
          <div className="relative ">
            {/* Left Arrow Button */}
            <button
              className="rounded-full absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2  z-10"
              onClick={() =>
                (document.getElementById("slider").scrollLeft -= 400)
              }
            >
              &#10094;
            </button>

            {/* Product Slider */}
            <div
              id="slider"
              className="flex overflow-x-hidden gap-4 py-4 scroll-smooth snap-x snap-mandatory w-full  mx-auto"
            >
              {Array.isArray(suggestions) && suggestions.length > 0 ? (
                suggestions.map((suggestion, idx) => (
                  <Link key={idx} href={`/products/${suggestion.id}`}>
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-xl h-full w-80 snap-start">
                      <Image
                        src={`/uploads/${suggestion.image?.[0]}`}
                        alt={suggestion.name}
                        width={400}
                        height={400}
                        className="ml-auto w-full h-80 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 overflow-hidden text-ellipsis line-clamp-1">
                          {suggestion.name}
                        </h3>
                        <p className="text-xl font-semibold text-gray-900 mt-2">
                          ₹{suggestion.price}
                        </p>
                      </div>
                      <div className="flex gap-4 mb-4 mr-4 ml-4">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-blue-600 active:text-inherit hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/2 text-center flex items-center justify-center"
                          disabled={loadingProduct === product.name}
                        >
                          Add to Cart
                        </button>

                        {/* Buy Now Button */}
                        <button
                          className="bg-green-600 active:text-inherit hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-1/2 text-center flex items-center justify-center"
                          onClick={() => handleBuyNow(product)}
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p>No suggestions available.</p>
              )}
            </div>

            {/* Right Arrow Button */}
            <button
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10"
              onClick={() =>
                (document.getElementById("slider").scrollLeft += 400)
              }
            >
              &#10095;
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
