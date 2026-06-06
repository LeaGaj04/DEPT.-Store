"use client"; // Esto es clave, le dice a Next.js que esto corre en el navegador
import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return <Toaster position="bottom-right" reverseOrder={false} />;
}