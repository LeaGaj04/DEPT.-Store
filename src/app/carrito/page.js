"use client";
import Link from "next/link";
import { Trash2 } from "lucide-react";
// 1. IMPORTAMOS EL CARRITO
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  // 2. TRAEMOS LOS DATOS Y FUNCIONES REALES DEL CONTEXTO
  const { cartItems, removeFromCart } = useCart();

  // 3. CÁLCULO DINÁMICO DE TOTALES
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 60000 ? 0 : 5000; // Envío gratis sobre $60.000
  const total = subtotal + shipping;

  const getWhatsAppLink = () => {
    const phoneNumber = "56912345678";
    let message = "Hola DEPT, quiero hacer este pedido:%0A%0A";
    cartItems.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (Talla: ${item.selectedSize}) - $${(item.price * item.quantity).toLocaleString('es-CL')}%0A`;
    });
    message += `%0A*Subtotal:* $${subtotal.toLocaleString('es-CL')}`;
    message += `%0A*Envío:* ${shipping === 0 ? 'Gratis' : '$' + shipping.toLocaleString('es-CL')}`;
    message += `%0A*Total:* $${total.toLocaleString('es-CL')}%0A%0A`;
    message += `¿Me indicas los datos para transferir?`;
    return `https://wa.me/${phoneNumber}?text=${message}`;
  };

  return (
    <div className="min-h-screen bg-black w-full pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-10">Tu Carrito</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LISTA DE PRODUCTOS DINÁMICA */}
          <div className="lg:col-span-8">
            {cartItems.length === 0 ? (
              <p className="text-gray-400">Tu carrito está vacío.</p>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex border-b border-gray-800 pb-6">
                    <div className="h-32 w-24 flex-shrink-0 overflow-hidden bg-gray-900">
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover object-center" />
                    </div>

                    <div className="ml-6 flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between text-sm font-bold uppercase tracking-wide text-white">
                          <h3>{item.name}</h3>
                          <p className="ml-4">${(item.price * item.quantity).toLocaleString('es-CL')}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-400">Talla: {item.selectedSize}</p>
                      </div>
                      
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-400">Cant: {item.quantity}</p>
                        {/* 4. CONECTAMOS EL BOTÓN ELIMINAR */}
                        <button 
                          onClick={() => removeFromCart(item.id, item.selectedSize)} 
                          className="font-medium text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RESUMEN DE COMPRA DINÁMICO */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 border border-gray-200">
              <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-6">Resumen</h2>
              
              <div className="space-y-4 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>${subtotal.toLocaleString('es-CL')}</p>
                </div>
                <div className="flex justify-between">
                  <p>Envío</p>
                  <p>{shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-CL')}`}</p>
                </div>
              </div>

              <div className="flex justify-between text-base font-black uppercase tracking-widest text-black border-t border-gray-200 pt-4 mb-8">
                <p>Total</p>
                <p>${total.toLocaleString('es-CL')}</p>
              </div>

              {cartItems.length > 0 ? (
                <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="w-full block text-center py-4 text-sm font-bold uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-colors">
                  Completar Pedido
                </a>
              ) : (
                <button disabled className="w-full block text-center py-4 text-sm font-bold uppercase tracking-widest bg-gray-300 text-gray-500 cursor-not-allowed">
                  Carrito Vacío
                </button>
              )}
              
              <Link href="/catalogo" className="w-full block text-center mt-4 py-4 text-sm font-bold uppercase tracking-widest border border-black text-black hover:bg-black hover:text-white transition-colors">
                Seguir Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}