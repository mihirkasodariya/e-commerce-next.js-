"use client";
export default function ShoppingCart() {
  return (
    <div className="bg-gray-100 text-gray-900 font-sans py-16 px-6 pt-28">
      <main className="max-w-5xl mx-auto">
        <section className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Return & Refund Policy</h1>
          <p className="text-lg leading-relaxed text-gray-600 mb-8">
            We're sorry you didn’t have a perfect shopping experience. If for any reason you're not fully satisfied with your purchase, we're here to help.
          </p>

          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-blue-600">Return Policy</h2>
            <p className="text-lg leading-relaxed text-gray-600">
              You can return most items within 10 days of delivery for a full refund or exchange. Please read the following details for the return process.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 m-4">Eligibility for Return</h3>
            <ul className="list-disc list-inside text-lg text-gray-600 space-y-4">
              <li>Items must be returned within 10 days of receiving your order.</li>
              <li>Products should be unused, and in their original packaging.</li>
              <li>Discounted or final sale items are non-returnable.</li>
              <li>All tags and labels must be intact on the items being returned.</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 m-4">How to Return Your Item</h3>
            <ol className="list-decimal list-inside text-lg text-gray-600 space-y-4">
              <li>Contact our customer support team at <strong>support@yourstorename.com</strong> within 10 days of receiving your order.</li>
              <li>Provide your order number, product details, and reason for return.</li>
              <li>Receive a return authorization and shipping instructions.</li>
              <li>Return the items using the provided shipping label in the original packaging.</li>
              <li>Once we receive the return, we will process your refund or exchange as requested.</li>
            </ol>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 m-4">Refunds & Exchanges</h3>
            <p className="text-lg leading-relaxed text-gray-600">
              Refunds will be issued to the original payment method within 7 business days after we receive and inspect your return. If you prefer an exchange, we will ship your replacement item immediately.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 m-4">Non-Returnable Items</h3>
            <ul className="list-disc list-inside text-lg text-gray-600 space-y-4">
              <li>Gift cards</li>
              <li>Personalized or custom-made products</li>
              <li>Items marked as final sale</li>
              <li>Opened or used products not in resalable condition</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 m-4">Return Shipping</h3>
            <p className="text-lg leading-relaxed text-gray-600">
              Customers are responsible for the cost of return shipping, unless the return is due to an error on our part or the item is defective.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 m-4">Damaged or Defective Items</h3>
            <p className="text-lg leading-relaxed text-gray-600">
              If your product is damaged or defective, please reach out to us immediately at <strong>support@mihir.com</strong>. We will arrange a return for a refund or exchange, with no additional shipping cost.
            </p>
          </div>

          <div className="mt-8">
            <h4 className="text-xl font-semibold text-gray-800 m-4">Need Help?</h4>
            <p className="text-lg text-gray-600">
              If you have any questions about your return or need assistance, please don’t hesitate to contact our customer support team at <strong>support@mihir.com</strong>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
