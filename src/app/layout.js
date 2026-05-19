import { Inter } from "next/font/google";
import "./globals.css";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
// 1. Importamos el proveedor del carrito
import { CartProvider } from "../context/CartContext";

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
          <main className="min-h-screen">
            {children}
          </main>
          {/* Footer original intacto */}
          <footer className="bg-black text-white py-12 mt-20 text-center text-sm uppercase tracking-widest">
            <p>© 2026 DEPT. Todos los derechos reservados.</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}