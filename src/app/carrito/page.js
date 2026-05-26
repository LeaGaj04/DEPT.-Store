"use client";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
// 1. Importamos tu contexto
import { useCart } from "../../context/CartContext";

// 2. MAPEAMOS LAS CATEGORÍAS A TUS FOTOS LOCALES
const imagenesPorCategoria = {
  "Trucker Hats": "/products/trucker.jpg",
  "Beanies": "/products/beanie.jpg",
  "Poleras": "/products/polera.jpg",
};

export default function CartPage() {
  // Traemos las funciones del cerebro
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  // Matemáticas automáticas
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 60000 ? 0 : 5000; // Envío gratis sobre $60.000
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-white w-full pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-black uppercase tracking-tighter text-black mb-10">
          Tu Carrito
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LADO IZQUIERDO: LISTA DE PRODUCTOS */}
          <div className="lg:col-span-8">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 font-medium">Tu carrito está vacío.</p>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item, index) => {
                  // 3. CALCULAMOS LA RUTA LOCAL AQUÍ ADENTRO DEL MAP
                  const rutaImagenLocal = imagenesPorCategoria[item.category] || "/products/default.jpg";

                  return (
                    <div key={index} className="flex border-b border-gray-200 pb-6">
                      <div className="h-32 w-24 flex-shrink-0 overflow-hidden bg-gray-100 relative">
                        {/* 🔥 Editado: Ahora usa la ruta local */}
                        <img 
                          src={rutaImagenLocal} 
                          alt={item.name} 
                          className="h-full w-full object-cover object-center" 
                        />
                      </div>

                      <div className="ml-6 flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between text-sm font-bold uppercase tracking-wide text-black">
                            <h3>{item.name}</h3>
                            <p className="ml-4">${(item.price * item.quantity).toLocaleString('es-CL')}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">Talla: {item.selectedSize}</p>
                        </div>
                        
                        <div className="flex flex-1 items-end justify-between text-sm">
                          {/* CONTROLES DE CANTIDAD (+ / -) */}
                          <div className="flex items-center border border-gray-300">
                            <button 
                              onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                              className="text-gray-500 hover:text-black p-2 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-black px-4 font-bold">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                              className="text-gray-500 hover:text-black p-2 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* BOTÓN ELIMINAR */}
                          <button 
                            onClick={() => removeFromCart(item.id, item.selectedSize)} 
                            className="font-medium text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* LADO DERECHO: RESUMEN DE COMPRA */}
          <div className="lg:col-span-4">
            <div className="bg-gray-50 p-6 border border-gray-200">
              <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-6">Resumen</h2>
              
              <div className="space-y-4 text-sm text-gray-600 mb-6 font-medium">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>${subtotal.toLocaleString('es-CL')}</p>
                </div>
                <div className="flex justify-between">
                  <p>Envío (Estimado)</p>
                  <p>{shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-CL')}`}</p>
                </div>
              </div>

              <div className="flex justify-between text-base font-black uppercase tracking-widest text-black border-t border-gray-200 pt-4 mb-8">
                <p>Total</p>
                <p>${total.toLocaleString('es-CL')}</p>
              </div>

              {cartItems.length > 0 ? (
                // AQUÍ CONECTAMOS CON LA PARTE B (CHECKOUT)
                <Link href="/checkout" className="w-full flex items-center justify-center py-4 text-sm font-bold uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-colors">
                  Ir al Pago
                </Link>
              ) : (
                <button disabled className="w-full block text-center py-4 text-sm font-bold uppercase tracking-widest bg-gray-200 text-gray-400 cursor-not-allowed">
                  Carrito Vacío
                </button>
              )}
              
              <Link href="/catalogo" className="w-full flex items-center justify-center mt-4 py-4 text-sm font-bold uppercase tracking-widest border border-black text-black hover:bg-black hover:text-white transition-colors">
                Seguir Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}