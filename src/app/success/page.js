"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext"; // Asegúrate de que esta ruta sea correcta

function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  
  // Parámetros de MercadoPago o Venti
  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("payment_id"); 
  
  // Parámetros de Webpay (los que configuramos nosotros)
  const ordenWebpay = searchParams.get("orden");
  const metodo = searchParams.get("metodo");

// Vaciamos el carrito apenas el cliente llega a esta página
  useEffect(() => {
    clearCart();
    localStorage.removeItem("latest_order_payer");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Determinamos qué ID mostrar dependiendo de la pasarela
  const finalOrderId = orderId || ordenWebpay || "Generando...";

  return (
    <div className="max-w-xl mx-auto w-full border border-gray-900 bg-zinc-950 p-8 md:p-12 text-center">
      <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">
        ¡Pago Aprobado!
      </h2>
      <p className="text-sm text-gray-400 mb-8">
        Tu orden ha sido procesada con éxito y ya estamos preparando tu streetwear.
      </p>

      <div className="bg-black border border-gray-900 p-6 text-left space-y-3 mb-8">
        <p className="text-xs uppercase tracking-widest text-gray-500">Detalles de la orden</p>
        
        <p className="text-sm text-white">
          <span className="font-bold">ID del Pedido:</span> #{finalOrderId}
        </p>

        {/* Si viene de MercadoPago */}
        {paymentId && (
          <p className="text-sm text-white">
            <span className="font-bold">N° de Transacción MP:</span> {paymentId}
          </p>
        )}

        {/* Si viene de Webpay */}
        {metodo === "webpay" && (
          <p className="text-sm text-white">
            <span className="font-bold">Método de pago:</span> Webpay Plus
          </p>
        )}
      </div>

      <Link 
        href="/catalogo" 
        className="inline-block bg-white text-black font-black uppercase tracking-widest text-xs px-8 py-4 hover:bg-gray-200 transition-colors"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-16 flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-white uppercase tracking-widest animate-pulse">Cargando estado...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}