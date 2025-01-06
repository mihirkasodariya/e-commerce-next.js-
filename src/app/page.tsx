import { Button } from "@/components/ui/button";
import Image from "next/image";
import Dashboard from "./(shop)/dashboard/page";
import Headers from "./(shop)/Header/page";
import Cookie from "@/components/ui/cookie"; // Import the CookieConsent component

export default async function Home() {
  return (
    <>
      <Headers />
      <Dashboard />
      <Cookie /> {/* Add the CookieConsent component here */}
    </>
  );
}
