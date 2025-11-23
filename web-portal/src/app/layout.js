// src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"; // Import it

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Community Service Platform",
  description: "Connecting Citizens and Government",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap the entire app here */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}