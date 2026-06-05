import { Inter } from "next/font/google";
import "./globals.css";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer"; 
// 1. Importamos el proveedor del carrito
import { CartProvider } from "../context/CartContext";
// 🎁 Importamos el nuevo componente del Popup y Viñeta flotante
import WelcomeDiscount from "../components/WelcomeDiscount"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DEPT STREETWEAR",
  description: "Minimalist urban streetwear brand.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      {/* Mantenemos tus colores originales intactos */}
      <body className={`${inter.className} bg-white text-black antialiased`}>
        {/* 2. Envolvemos la app en el CartProvider */}
        <CartProvider>
          <TopBar />
          <Header />
          
          {/* ⚡ El sistema de descuento corre aquí de forma invisible controlando los tiempos */}
          <WelcomeDiscount />

          <main className="min-h-screen">
            {children}
          </main>
          
          {/* 3. AQUÍ REEMPLAZAMOS EL FOOTER VIEJO POR EL NUEVO COMPONENTE */}
          <Footer />
          
        </CartProvider>
      </body>
    </html>
  );
}