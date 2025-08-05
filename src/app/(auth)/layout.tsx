import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "../sections/Footer";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}
