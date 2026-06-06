"use client";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import Link from "next/link";

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [metodoPago, setMetodoPago] = useState("venti");
  const [cargando, setCargando] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "", apellido: "", email: "", telefono: "",
    rut: "", region: "", comuna: "", calle: "", numero: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePagar = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert("Tu carrito está vacío");

    setCargando(true);

    try {
      // 🚀 DETERMINAMOS A QUÉ API LLAMAR SEGÚN EL MÉTODO SELECCIONADO
      let endpoint = "";
      if (metodoPago === "venti") endpoint = "/api/checkout/venti";
      else if (metodoPago === "mercadopago") endpoint = "/api/checkout/mercadopago";
      else if (metodoPago === "webpay") endpoint = "/api/checkout/webpay";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          payer: formData,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        localStorage.setItem("latest_order_payer", JSON.stringify(formData));

        // 👇 AGREGA ESTAS DOS LÍNEAS NUEVAS AQUÍ 👇
        localStorage.setItem("latest_order_items", JSON.stringify(cartItems));
        localStorage.setItem("latest_order_total", getCartTotal().toString());
        // 👆 HASTA AQUÍ 👆

        // 🔥 Si la API devuelve un token...
        if (data.token) {
          window.location.href = `${data.url}?token_ws=${data.token}`;
        } else {
          window.location.href = data.url;
        }
      } else {
        throw new Error(data.error || `No se pudo generar el link de pago con ${metodoPago}`);
      }
    } catch (error) {
      console.error("Error en el proceso de pago:", error);
      alert(`Hubo un error: ${error.message}`);
      setCargando(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12 border-b border-zinc-900 pb-6">
          Checkout
        </h1>

        <form onSubmit={handlePagar} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* FORMULARIO DE ENVÍO */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6 border-b border-zinc-900 pb-2">
                1. Datos de Contacto
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" name="nombre" placeholder="Nombre" onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-900 p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors" />
                <input required type="text" name="apellido" placeholder="Apellido" onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-900 p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors" />
                <input required type="email" name="email" placeholder="Correo Electrónico" onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-900 p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors md:col-span-2" />
                <input required type="text" name="telefono" placeholder="Teléfono de contacto" onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-900 p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors" />
                <input required type="text" name="rut" placeholder="RUT (ej: 12.345.678-9)" onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-900 p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors" />
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6 border-b border-zinc-900 pb-2">
                2. Dirección de Despacho
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" name="region" placeholder="Región" onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-900 p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors" />
                <input required type="text" name="comuna" placeholder="Comuna" onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-900 p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors" />
                <input required type="text" name="calle" placeholder="Calle / Avenida" onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-900 p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors md:col-span-2" />
                <input required type="text" name="numero" placeholder="Número de Casa/Depto/Block" onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-900 p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors" />
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6 border-b border-zinc-900 pb-2">
                3. Método de Pago
              </h2>
              <div className="space-y-3">
                {/* OPCIÓN VENTI */}
                <label className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${metodoPago === 'venti' ? 'border-white bg-zinc-950' : 'border-zinc-900 bg-transparent hover:border-zinc-700'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" checked={metodoPago === "venti"} onChange={() => setMetodoPago("venti")} className="accent-white cursor-pointer" />
                    <span className="text-sm font-bold uppercase tracking-wider">Venti</span>
                  </div>
                  <span className="text-xs text-zinc-400">Tarjetas y Transferencias</span>
                </label>

                {/* OPCIÓN MERCADOPAGO */}
                <label className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${metodoPago === 'mercadopago' ? 'border-white bg-zinc-950' : 'border-zinc-900 bg-transparent hover:border-zinc-700'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" checked={metodoPago === "mercadopago"} onChange={() => setMetodoPago("mercadopago")} className="accent-white cursor-pointer" />
                    <span className="text-sm font-bold uppercase tracking-wider">MercadoPago (Sin Servicio)</span>
                  </div>
                  <span className="text-xs text-zinc-400">Tarjetas de Crédito / Débito</span>
                </label>

                {/* OPCIÓN WEBPAY / TRANSBANK */}
                <label className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${metodoPago === 'webpay' ? 'border-white bg-zinc-950' : 'border-zinc-900 bg-transparent hover:border-zinc-700'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" checked={metodoPago === "webpay"} onChange={() => setMetodoPago("webpay")} className="accent-white cursor-pointer" />
                    <span className="text-sm font-bold uppercase tracking-wider">Webpay Plus</span>
                  </div>
                  <span className="text-xs text-zinc-400">Tarjetas y Redcompra</span>
                </label>
              </div>
            </div>
          </div>

          {/* RESUMEN DE COMPRA */}
          <div className="lg:col-span-5">
            <div className="border border-zinc-900 bg-zinc-950 p-6 sticky top-28 text-left">
              <h2 className="text-sm font-bold uppercase tracking-widest border-b border-zinc-900 pb-4 mb-6">Tu Carrito</h2>
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-zinc-500 uppercase tracking-widest mb-4">No tienes prendas.</p>
                  <Link href="/catalogo" className="inline-block border border-zinc-800 text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2 hover:bg-white hover:text-black transition-colors">Ir al catálogo</Link>
                </div>
              ) : (
                <>
                  <div className="max-h-64 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between border-b border-zinc-900 pb-4">
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-tight text-white">{item.name}</h4>
                          <p className="text-xs text-zinc-400 uppercase mt-0.5">Talla: {item.selectedSize} × {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-white">${(item.price * item.quantity).toLocaleString("es-CL")}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-baseline mb-8 border-t border-zinc-900 pt-6">
                    <span className="text-sm font-bold uppercase tracking-widest text-white">Total</span>
                    <span className="text-2xl font-black text-white">${getCartTotal().toLocaleString("es-CL")}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={cargando}
                    className="w-full bg-white text-black text-xs font-black uppercase tracking-widest py-4 hover:bg-zinc-200 transition-colors disabled:opacity-50 tracking-[0.15em]"
                  >
                    {cargando ? "Procesando..." : "Confirmar y Pagar"}
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}