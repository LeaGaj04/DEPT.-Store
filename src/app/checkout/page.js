"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  
  // Estado para guardar los datos del cliente
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    comuna: "",
    region: ""
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 60000 ? 0 : 5000;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí es donde en el futuro conectaremos la API de Webpay/MercadoPago
    console.log("Datos del cliente listos para pagar:", formData);
    console.log("Total a cobrar:", total);
    alert("¡Formulario listo! El siguiente paso será conectarlo a la pasarela de pago.");
  };

  // Si entran al checkout sin nada en el carrito, los devolvemos
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-black font-bold uppercase tracking-widest">No hay productos por pagar.</p>
        <Link href="/catalogo" className="text-gray-500 underline hover:text-black">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-black mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* FORMULARIO DE ENVÍO */}
          <div className="lg:col-span-7">
            <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-6">Datos de Envío</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Nombre</label>
                  <input required type="text" name="nombre" onChange={handleChange} className="w-full border border-gray-300 p-3 text-black focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Apellido</label>
                  <input required type="text" name="apellido" onChange={handleChange} className="w-full border border-gray-300 p-3 text-black focus:outline-none focus:border-black" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Email</label>
                  <input required type="email" name="email" onChange={handleChange} className="w-full border border-gray-300 p-3 text-black focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Teléfono</label>
                  <input required type="tel" name="telefono" onChange={handleChange} className="w-full border border-gray-300 p-3 text-black focus:outline-none focus:border-black" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Dirección (Calle y Número)</label>
                <input required type="text" name="direccion" onChange={handleChange} className="w-full border border-gray-300 p-3 text-black focus:outline-none focus:border-black" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Comuna</label>
                  <input required type="text" name="comuna" onChange={handleChange} className="w-full border border-gray-300 p-3 text-black focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Región</label>
                  <input required type="text" name="region" onChange={handleChange} className="w-full border border-gray-300 p-3 text-black focus:outline-none focus:border-black" />
                </div>
              </div>

              <button type="submit" className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors mt-8">
                Proceder al Pago
              </button>
            </form>
          </div>

          {/* MINI RESUMEN DEL PEDIDO */}
          <div className="lg:col-span-5">
            <div className="bg-gray-50 p-6 border border-gray-200 sticky top-24">
              <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-6">Tu Pedido</h2>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-12 bg-gray-100 flex-shrink-0">
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-black">{item.name}</p>
                        <p className="text-xs text-gray-500">Talla: {item.selectedSize} | Cant: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-black">${(item.price * item.quantity).toLocaleString('es-CL')}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4 font-medium">
                <div className="flex justify-between"><p>Subtotal</p><p>${subtotal.toLocaleString('es-CL')}</p></div>
                <div className="flex justify-between"><p>Envío</p><p>{shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-CL')}`}</p></div>
              </div>
              <div className="flex justify-between text-base font-black uppercase tracking-widest text-black border-t border-gray-200 pt-4">
                <p>Total a Pagar</p><p>${total.toLocaleString('es-CL')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}