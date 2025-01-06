This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev 
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



# Order Status Codes

This document lists the order status codes and their meanings used in the system.

## Order Processing
1. **Pending** - Order received but not yet processed.
2. **Ready for Dispatch** - Order is packed and ready to be shipped.
3. **Shipped** - Order has been handed over to the shipping carrier.
4. **In Transit** - Order is on its way to the destination.
5. **Out for Delivery** - Order is with the delivery agent and will arrive soon.
6. **Cancelled** - Order was cancelled by the customer or merchant.
7. **Delivered** - Order has been delivered to the customer.



## Order Hold or Issues
10. **On Hold** - Order is temporarily paused (e.g., pending customer action or stock issues).
11. **Awaiting Fulfillment** - Order is waiting for inventory restocking.
12. **Address Issue** - Delivery address needs confirmation or correction.
13. **Payment Failed** - Payment was not successful.

## Order Completion
14. **Completed** - Order successfully delivered and transaction finalized.
16. **Refunded** - Payment was refunded to the customer.

## Return/Exchange
17. **Return Requested** - Customer has initiated a return.
18. **Return Approved** - Return request has been approved.
19. **Return Received** - Returned item has been received.
20. **Refund Processed** - Refund has been issued for the returned order.
21. **Exchange Initiated** - Customer has requested an exchange.
22. **Exchange Completed** - Exchange process finalized.

## Customizable or Special Cases
23. **Customizing** - Order is being customized based on customer preferences.
24. **Pre-Order** - Order placed for an item not yet released or in stock.
25. **Backordered** - Order placed for an item temporarily out of stock.



## Payment Method Type
1. **paypal** 
2. **Credit/Debit Card**
