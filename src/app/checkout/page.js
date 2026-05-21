"use client";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [metodoPago, setMetodoPago] = useState("transferencia"); // por defecto
  const [procesando, setProcesando] = useState(false);
  const [pedidoCompletado, setPedidoCompletado] = useState(null);

  // Formulario de envío
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const RegistrarPedidoEnFirebase = async (estadoPago) => {
    const orden = {
      cliente: formData,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.selectedSize
      })),
      total: getCartTotal(),
      metodoPago: metodoPago,
      estadoPago: estadoPago, // "pendiente_transferencia", "pendiente_pago_mp", etc.
      fecha: serverTimestamp(),
    };

    // Guarda la orden en una nueva colección "pedidos" en Firestore
    const docRef = await addDoc(collection(db, "pedidos"), orden);
    return docRef.id;
  };

  const handlePagar = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert("Tu carrito está vacío");

    setProcesando(true);

    try {
      if (metodoPago === "transferencia") {
        // --- OPCIÓN 1: TRANSFERENCIA ---
        const pedidoId = await RegistrarPedidoEnFirebase("pendiente_transferencia");
        setPedidoCompletado({ id: pedidoId, tipo: "transferencia" });
        clearCart(); // Limpiamos el carro del cliente
      } else if (metodoPago === "mercadopago") {
        // --- OPCIÓN 2: MERCADOPAGO (CORREGIDO E INTEGRADO AQUÍ) ---
        const pedidoId = await RegistrarPedidoEnFirebase("pendiente_pago_mp");

        // Llamamos a nuestra API interna en el servidor
        const response = await fetch("/api/checkout/mercadopago", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              size: item.selectedSize
            })), 
            orderId: pedidoId
          }),
        });

        const data = await response.json();

        if (data.url) {
          clearCart(); // Limpiamos el carrito local
          window.location.href = data.url; // 🚀 Redirigimos al cliente a MercadoPago
        } else {
          throw new Error(data.error || "No se pudo generar el link de pago");
        }
      } else if (metodoPago === "venti") {
        // --- OPCIÓN 3: VENTI ---
        alert("Integrando la API de Venti a continuación...");
        // Aquí conectaremos la API Route de Venti próximamente
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert(error.message || "Hubo un problema procesando tu orden.");
    } finally {
      setProcesando(false);
    }
  };

  // PANTALLA DE ÉXITO PARA TRANSFERENCIA
  if (pedidoCompletado?.tipo === "transferencia") {
    return (
      <div className="bg-black min-h-screen text-white pt-32 pb-16 flex items-center justify-center px-4">
        <div className="max-w-xl w-full border border-gray-900 bg-zinc-950 p-8 md:p-12 text-center rounded-none">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">¡Orden Recibida!</h2>
          <p className="text-xs text-gray-400 tracking-widest uppercase mb-8">Pedido ID: #{pedidoCompletado.id}</p>

          <div className="border-t border-b border-gray-900 py-6 text-left space-y-4 mb-8">
            <p className="text-sm font-bold uppercase tracking-wider text-gray-300">Para completar tu compra, transfiere el total a la siguiente cuenta:</p>
            <div className="bg-black p-4 space-y-2 text-xs font-mono text-gray-400 border border-gray-900">
              <p><strong className="text-white">Banco:</strong> Banco Estado / Banco de Chile (Cambia por el tuyo)</p>
              <p><strong className="text-white">Tipo:</strong> Cuenta Corriente / Vista</p>
              <p><strong className="text-white">Número:</strong> 123456789</p>
              <p><strong className="text-white">Rut:</strong> 11.222.333-4</p>
              <p><strong className="text-white">Mail:</strong> pagos@deptstreetwear.com</p>
            </div>
            <p className="text-[11px] text-gray-500 italic">Envía el comprobante a nuestro correo indicando tu ID de pedido para despachar tu ropa.</p>
          </div>

          <a href="/catalogo" className="inline-block bg-white text-black font-black uppercase tracking-widest text-xs px-8 py-4 hover:bg-gray-200 transition-colors">
            Volver al Catálogo
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12 border-b border-gray-900 pb-6">Checkout</h1>

        <form onSubmit={handlePagar} className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* COLUMNA IZQUIERDA: DATOS Y PASARELAS */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-300">Datos de Despacho</h2>
              <input required type="text" name="nombre" placeholder="Nombre Completo" value={formData.nombre} onChange={handleInputChange} className="w-full bg-zinc-950 border border-gray-900 p-4 text-sm text-white focus:outline-none focus:border-white transition-colors" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="email" name="email" placeholder="Correo Electrónico" value={formData.email} onChange={handleInputChange} className="w-full bg-zinc-950 border border-gray-900 p-4 text-sm text-white focus:outline-none focus:border-white transition-colors" />
                <input required type="tel" name="telefono" placeholder="Teléfono de Contacto" value={formData.telefono} onChange={handleInputChange} className="w-full bg-zinc-950 border border-gray-900 p-4 text-sm text-white focus:outline-none focus:border-white transition-colors" />
              </div>
              <input required type="text" name="direccion" placeholder="Dirección (Calle, Número, Departamento)" value={formData.direccion} onChange={handleInputChange} className="w-full bg-zinc-950 border border-gray-900 p-4 text-sm text-white focus:outline-none focus:border-white transition-colors" />
              <input required type="text" name="ciudad" placeholder="Ciudad / Región" value={formData.ciudad} onChange={handleInputChange} className="w-full bg-zinc-950 border border-gray-900 p-4 text-sm text-white focus:outline-none focus:border-white transition-colors" />
            </div>

            {/* SELECCIÓN DE PASARELAS */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-300">Método de Pago</h2>
              <div className="grid grid-cols-1 gap-3">

                {/* Botón Opción Transferencia */}
                <label className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${metodoPago === "transferencia" ? "border-white bg-zinc-900" : "border-gray-900 bg-zinc-950 hover:border-gray-700"}`}>
                  <div className="flex items-center space-x-3">
                    <input type="radio" name="payment" checked={metodoPago === "transferencia"} onChange={() => setMetodoPago("transferencia")} className="accent-white" />
                    <span className="text-sm font-bold uppercase tracking-wider">Transferencia Bancaria Directa</span>
                  </div>
                </label>

                {/* Botón Opción MercadoPago */}
                <label className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${metodoPago === "mercadopago" ? "border-white bg-zinc-900" : "border-gray-900 bg-zinc-950 hover:border-gray-700"}`}>
                  <div className="flex items-center space-x-3">
                    <input type="radio" name="payment" checked={metodoPago === "mercadopago"} onChange={() => setMetodoPago("mercadopago")} className="accent-white" />
                    <span className="text-sm font-bold uppercase tracking-wider">MercadoPago (Crédito / Débito)</span>
                  </div>
                </label>

                {/* Botón Opción Venti */}
                <label className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${metodoPago === "venti" ? "border-white bg-zinc-900" : "border-gray-900 bg-zinc-950 hover:border-gray-700"}`}>
                  <div className="flex items-center space-x-3">
                    <input type="radio" name="payment" checked={metodoPago === "venti"} onChange={() => setMetodoPago("venti")} className="accent-white" />
                    <span className="text-sm font-bold uppercase tracking-wider">Venti Pay</span>
                  </div>
                </label>

              </div>
            </div>

            <button type="submit" disabled={procesando} className="w-full bg-white text-black font-black uppercase tracking-widest text-sm py-5 hover:bg-gray-200 transition-colors disabled:bg-gray-600 disabled:text-gray-400">
              {procesando ? "Procesando Orden..." : "Confirmar y Pagar"}
            </button>
          </div>

          {/* COLUMNA DERECHA: RESUMEN DE COMPRA */}
          <div className="lg:col-span-5 bg-zinc-950 border border-gray-900 p-6 h-fit space-y-6">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-900 pb-4">Tu Carrito</h2>

            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500 uppercase tracking-widest py-4 text-center">No hay productos seleccionados.</p>
            ) : (
              <div className="divide-y divide-gray-900 max-h-80 overflow-y-auto pr-2">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-4 text-sm">
                    <div>
                      <h4 className="font-bold uppercase text-white">{item.name}</h4>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">Talla: {item.selectedSize || "U"} x{item.quantity}</p>
                    </div>
                    <span className="font-medium text-gray-300">${(item.price * item.quantity).toLocaleString("es-CL")}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-gray-900 pt-4 flex justify-between items-center text-lg font-black uppercase tracking-tighter">
              <span>Total a Pagar</span>
              <span className="text-white text-2xl">${getCartTotal().toLocaleString("es-CL")} CLP</span>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}