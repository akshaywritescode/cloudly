import { Poppins } from "next/font/google";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100","200", "300", "400", "500", "600", "700", "800"], // Choose the weights you need
  style: ["normal", "italic"], // Optional: Choose styles if needed
  display: "swap", // Optional: Adds swap for better performance
});
