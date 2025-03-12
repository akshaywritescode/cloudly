import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "./fonts";

export const metadata: Metadata = {
  title: "Cloudly - Organised, Secure, Always Accessible",
  description:
    "Cloudly is a modern cloud storage solution that keeps your files secure and accessible anywhere.",
  keywords: [
    "cloud storage",
    "file sharing",
    "secure storage",
    "Cloudly",
    "online backup",
  ],
  authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
  openGraph: {
    title: "Cloudly - Organised, Secure, Always Accessible",
    description:
      "Cloudly is a modern cloud storage solution that keeps your files secure and accessible anywhere.",
    url: "https://yourwebsite.com",
    siteName: "Cloudly",
    images: [
      {
        url: "https://yourwebsite.com/og-image.jpg", // Update with your actual image URL
        width: 1200,
        height: 630,
        alt: "Cloudly Cloud Storage Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@your_twitter_handle", // Replace with your Twitter handle
    creator: "@your_twitter_handle",
    title: "Cloudly - Organised, Secure, Always Accessible",
    description:
      "Cloudly is a modern cloud storage solution that keeps your files secure and accessible anywhere.",
    images: ["https://yourwebsite.com/og-image.jpg"],
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className={`${poppins.className} antialiased overflow-x-hidden max-w-[1400px]`}>
        {children}
      </body>
    </html>
  );
}
