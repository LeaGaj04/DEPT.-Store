"use client";
import Link from "next/link";

export default function PendingPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-16 flex items-center justify-center px-4">
      <div className="max-w-xl mx-auto w-full border border-yellow-600 bg-zinc-950 p-8 md:p-12 text-center">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-yellow-500">
          Pago en Proceso
        </h2>
        <p className="text-sm text-gray-400 mb-8">
          MercadoPago está validando tu transacción. Tan pronto como se apruebe, procesaremos tu despacho.
        </p>
        <Link 
          href="/catalogo" 
          className="inline-block bg-white text-black font-black uppercase tracking-widest text-xs px-8 py-4 hover:bg-gray-200 transition-colors"
        >
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}