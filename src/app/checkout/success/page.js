"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "../../../context/CartContext"; // Asegúrate de que esta ruta sea correcta

function SuccessContent() {
  const searchParams = useSearchParams();
  // 1. Agregamos cartItems y getCartTotal para enviarlos por correo
  const { cartItems, getCartTotal, clearCart } = useCart();
  const correoEnviado = useRef(false); // Escudo para que no mande doble correo

  // Parámetros de MercadoPago o Venti
  const orderId = searchParams.get("orderId");
  const paymentId = searchParams.get("payment_id");

  // Parámetros de Webpay (los que configuramos nosotros)
  const ordenWebpay = searchParams.get("orden");
  const metodo = searchParams.get("metodo");

  // Determinamos qué ID mostrar dependiendo de la pasarela
  const finalOrderId = orderId || ordenWebpay || "Generando...";

  // Vaciamos el carrito apenas el cliente llega a esta página
  useEffect(() => {
    const procesarVenta = async () => {
      // Leemos los datos desde el localStorage, no desde el useCart
      const orderItems = JSON.parse(localStorage.getItem("latest_order_items") || "null");
      const payerData = JSON.parse(localStorage.getItem("latest_order_payer") || "null");
      const orderTotal = parseFloat(localStorage.getItem("latest_order_total") || "0");

      // Si hay productos guardados y no hemos mandado el correo...
      if (orderItems && orderItems.length > 0 && !correoEnviado.current) {
        correoEnviado.current = true; // Bloqueamos

        const fechaActual = new Date().toLocaleString('es-CL', {
          dateStyle: 'short',
          timeStyle: 'short',
        });

        // 🚀 DISPARAMOS EL CORREO
        try {
          await fetch("/api/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: finalOrderId,
              total: orderTotal,
              buyer: payerData,
              items: orderItems,
              date: fechaActual
            }),
          });
        } catch (error) {
          console.error("Error al mandar el correo:", error);
        }
      }

      // 4. Limpiamos TODO para que quede limpiecito para la próxima compra
      clearCart();
      localStorage.removeItem("latest_order_payer");
      localStorage.removeItem("latest_order_items");
      localStorage.removeItem("latest_order_total");
    };

    procesarVenta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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