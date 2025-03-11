import { Poppins, Montserrat } from "next/font/google";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", ], // Choose the weights you need
  style: ["normal", "italic"], // Optional: Choose styles if needed
  display: "swap", // Optional: Adds swap for better performance
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500",], // Choose the weights you need
  style: ["normal", "italic"], // Optional: Choose styles if needed
  display: "swap", // Optional: Adds swap for better performance
})