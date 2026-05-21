"use client";
import Link from "next/link";

export default function FailurePage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-16 flex items-center justify-center px-4">
      <div className="max-w-xl mx-auto w-full border border-red-900 bg-zinc-950 p-8 md:p-12 text-center">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-red-500">
          Pago Cancelado o Rechazado
        </h2>
        <p className="text-sm text-gray-400 mb-8">
          Hubo un problema al procesar tu pago o decidiste cancelar la transacción. No te preocupes, no se ha realizado ningún cobro.
        </p>
        <Link 
          href="/checkout" 
          className="inline-block bg-white text-black font-black uppercase tracking-widest text-xs px-8 py-4 hover:bg-gray-200 transition-colors"
        >
          Volver al Checkout
        </Link>
      </div>
    </div>
  );
}