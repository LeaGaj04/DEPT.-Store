import { Inter } from "next/font/google";
import "./globals.css";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer"; 
import { CartProvider } from "../context/CartContext";
import WelcomeDiscount from "../components/WelcomeDiscount"; 
// 👇 Cambiamos la importación aquí 👇
import ToasterProvider from "../components/ToasterProvider"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DEPT STREETWEAR",
  description: "Minimalist urban streetwear brand.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-white text-black antialiased`}>
        <CartProvider>
          <TopBar />
          <Header />
          <WelcomeDiscount />

          <main className="min-h-screen">
            {children}
          </main>
          
          <Footer />
        </CartProvider>

        {/* 👇 Y usamos el nuevo proveedor aquí 👇 */}
        <ToasterProvider />
      </body>
    </html>
  );
}