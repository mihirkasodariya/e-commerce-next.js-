"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/admin/getProduct"
        );
        const data = await response.json();

        if (data.success && data.data.data.length > 0) {
          const fetchedProducts = data.data.data.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            imageUrl: `/uploads/${product.image[0]}`,
          }));
          setProducts(fetchedProducts);
        } else {
          toast.error("No products available");
        }
      } catch (error) {
        toast.error("An error occurred while fetching products");
      }
    };

    fetchProducts();
  }, []);

  const apiAddToCart = async (product) => {
    setLoadingProduct(product.id);
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
          quantity: 1,
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

  const handleAddToCart = (product) => {
    apiAddToCart(product);
    router.push("/cart");
  };

  // const handleBuyNow = (product) => {
  //   setLoadingProduct(product.name);
  //   console.log(`Buying product now: ${product.name}`);
  //   // router.push("/checkout/" + product.name + product.quantity + product.price + product.id);
  //   setTimeout(() => setLoadingProduct(null), 2000);
  // };

  return (
    <div className="pl-5 pr-5 pt-5">
      <section className="py-12">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Link href={`/products/${product.id}`} passHref>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="ml-8 w-70 h-80 cursor-pointer object-contain"
                />
              </Link>
              <div className="flex flex-col justify-between p-6 flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 truncate">
                  {product.name}
                </h3>
                <p className="text-lg font-medium text-gray-600 my-2">
                  &#8377; {product.price}
                </p>

                <div
                  className={`flex gap-4 ${
                    loadingProduct === product.id ? "pointer-events-none" : ""
                  }`}
                >
                  {/* Add to Cart Button */}
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/2 text-center flex items-center justify-center transform transition duration-300 ease-in-out hover:scale-105 hover:animate-pulse"
                    type="button"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>

                  {/* Buy Now Button */}
                  {/* <button
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-1/2 text-center flex items-center justify-center transform transition duration-300 ease-in-out hover:scale-105 hover:animate-pulse"
                    type="button"
                    onClick={() => handleBuyNow(product)}
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
                            quantity: "1",
                            price: product.price,
                            image: product.imageUrl,
                          },
                        ]),
                      },
                    }}
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
