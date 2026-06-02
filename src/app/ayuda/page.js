"use client";
import { useState } from "react";

export default function AyudaPage() {
  // Pestaña activa por defecto
  const [activeTab, setActiveTab] = useState("ayuda");
  // Para controlar qué pregunta del acordeón está abierta
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Contenido organizado exactamente como tu footer
  const secciones = {
    ayuda: {
      titulo: "Servicio y Ayuda",
      items: [
        {
          q: "Contacto",
          a: "Puedes comunicarte con nuestro equipo de soporte enviando un correo directamente a dept.contact@gmail.com o a través de nuestro canal oficial de Instagram. Respondemos de lunes a viernes entre las 09:00 y las 18:00 hrs."
        },
        {
          q: "Envíos y Despachos",
          a: "Realizamos envíos a todo Chile continental. Los tiempos de despacho varían entre 2 a 5 días hábiles para la Región Metropolitana, y de 4 a 9 días hábiles para regiones extremas. Recibirás un correo cuando tu orden sea entregada al courier."
        },
        {
          q: "Seguimiento de Pedido",
          a: "Una vez que tu pedido sea procesado y enviado, adjuntaremos el número de seguimiento de la empresa de transporte a tu perfil en DEPT. STUDIO. También puedes rastrearlo directamente con tu código de compra en la sección de tracking de nuestra web."
        },
        {
          q: "Preguntas Frecuentes",
          a: "¿Puedo modificar mi dirección después de comprar? Sí, siempre y cuando el producto no haya salido de nuestra bodega. Escríbenos de inmediato a soporte con tu número de orden (#) para realizar el ajuste en la etiqueta."
        }
      ]
    },
    studio: {
      titulo: "Dept Studio",
      items: [
        {
          q: "Sobre Nosotros",
          a: "DEPT. STUDIO es un proyecto y laboratorio experimental de streetwear enfocado en el diseño minimalista, siluetas contemporáneas y alta calidad textil. Cada pieza está pensada para integrarse de forma atemporal en tu uso diario."
        },
        {
          q: "Campañas",
          a: "Nuestras campañas conceptuales exploran la cultura urbana, la música y la arquitectura moderna. Cada lanzamiento (Drop) viene acompañado de una propuesta visual única que define la identidad de la temporada."
        },
        {
          q: "Novedades",
          a: "Trabajamos bajo el formato de drops limitados para evitar la sobreproducción. Te recomendamos suscribirte a nuestro Newsletter en el footer para obtener acceso anticipado exclusivo e información sobre restocks."
        }
      ]
    },
    tienda: {
      titulo: "Información de Tienda",
      items: [
        {
          q: "Dónde Encontrarnos",
          a: "Actualmente operamos de forma 100% online a través de nuestro e-commerce oficial, despachando desde nuestro centro de distribución en Santiago, Chile. Próximamente anunciaremos nuestros primeros puntos de venta físicos y Pop-up stores."
        },
        {
          q: "Guía de Tallas",
          a: "Nuestros cortes son generalmente Oversized (calce holgado). Te sugerimos revisar las medidas exactas en centímetros detalladas en cada producto antes de comprar. Si prefieres un calce regular o al cuerpo, te recomendamos pedir una talla menos de la habitual."
        },
        {
          q: "Métodos de Pago",
          a: "Aceptamos todo tipo de tarjetas de débito y crédito bancarias a través de nuestra pasarela de pago segura (Webpay/MercadoPago). También admitimos transferencias electrónicas directas verificadas."
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-white text-black pt-16 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO MINIMALISTA */}
        <div className="mb-16 border-b border-zinc-100 pb-8">
          <h1 className="text-3xl font-black uppercase tracking-widest text-black">
            Centro de Información
          </h1>
          <p className="text-xs uppercase tracking-wider text-zinc-400 mt-2 font-medium">
            Encuentra todo lo relacionado con pedidos, envíos y la filosofía de DEPT. STUDIO
          </p>
        </div>

        {/* CONTENEDOR PRINCIPAL: Grid de 2 columnas en pantallas grandes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
          
          {/* MENÚ DE PESTAÑAS (IZQUIERDA) */}
          <div className="md:col-span-1 flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 border-b md:border-b-0 border-zinc-100">
            <button
              onClick={() => { setActiveTab("ayuda"); setOpenFaq(null); }}
              className={`text-xs uppercase font-bold tracking-widest px-4 py-3 text-left whitespace-nowrap transition-colors ${
                activeTab === "ayuda" 
                  ? "bg-black text-white" 
                  : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100"
              }`}
            >
              AYUDA & SOPORTE
            </button>
            <button
              onClick={() => { setActiveTab("studio"); setOpenFaq(null); }}
              className={`text-xs uppercase font-bold tracking-widest px-4 py-3 text-left whitespace-nowrap transition-colors ${
                activeTab === "studio" 
                  ? "bg-black text-white" 
                  : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100"
              }`}
            >
              DEPT STUDIO
            </button>
            <button
              onClick={() => { setActiveTab("tienda"); setOpenFaq(null); }}
              className={`text-xs uppercase font-bold tracking-widest px-4 py-3 text-left whitespace-nowrap transition-colors ${
                activeTab === "tienda" 
                  ? "bg-black text-white" 
                  : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100"
              }`}
            >
              TIENDA & INFORMACIÓN
            </button>
          </div>

          {/* CONTENIDO DESPLEGABLE (DERECHA) */}
          <div className="md:col-span-3 space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-black mb-6 border-b border-zinc-900 pb-2">
              {secciones[activeTab].titulo}
            </h2>

            <div className="space-y-3">
              {secciones[activeTab].items.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx} 
                    className="border border-zinc-200 bg-white rounded-none transition-all"
                  >
                    {/* Botón de la Pregunta */}
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex justify-between items-center px-5 py-4 text-left focus:outline-none bg-[#e8f0fe]/30 hover:bg-[#e8f0fe]/60 transition-colors"
                    >
                      <span className="text-xs font-bold uppercase tracking-widest text-black">
                        {item.q}
                      </span>
                      <span className="text-sm font-bold text-black ml-4">
                        {isOpen ? "—" : "+"}
                      </span>
                    </button>

                    {/* Respuesta Desplegable */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-60 border-t border-zinc-100" : "max-h-0"
                      }`}
                    >
                      <div className="p-5 text-sm text-zinc-600 leading-relaxed font-medium">
                        {item.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}