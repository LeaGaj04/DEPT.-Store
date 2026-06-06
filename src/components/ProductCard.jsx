"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext'; 
import { toast } from "react-hot-toast";

const imagenesPorCategoria = {
  "Trucker Hats": "/products/trucker.jpg",
  "Beanies": "/products/beanie.jpg",
  "Poleras": "/products/polera.jpg",
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  // 🔥 Este estado controla si mostramos las tallas o el botón normal
  const [showSizes, setShowSizes] = useState(false);

  // 1. Lógica mejorada para encontrar la imagen (Busca en Firebase primero, luego usa las locales)
  const imagenProducto = product.image || product.imageUrl || (product.images && product.images[0]) || imagenesPorCategoria[product.category] || "/products/default.jpg";

  // 2. Función que despliega las tallas
  const handleIntentarAgregar = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Evita que se abra el Link del producto
    
    if (product.status === "Agotado") return;

    // Si el producto no tiene tallas configuradas, lo agrega de inmediato como "Talla Única (U)"
    if (!product.sizes || product.sizes.length === 0) {
      agregarAlCarritoFinal(e, "U");
    } else {
      // Si tiene tallas, mostramos los botones de selección
      setShowSizes(true);
    }
  };

  // 3. Función que se ejecuta cuando el cliente hace clic en una talla específica
  const agregarAlCarritoFinal = (e, sizeSelected) => {
    e.preventDefault();
    e.stopPropagation();

    // Agregamos al carrito con la talla exacta que eligió
    addToCart(product, sizeSelected);
    
    // Ocultamos el menú de tallas para que vuelva a decir "Agregar"
    setShowSizes(false);

    // Disparamos la notificación negra premium
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } transform transition-all duration-300 max-w-sm w-full bg-black border border-zinc-800 shadow-2xl flex pointer-events-auto z-[9999]`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            {/* Foto del Producto (Con fondo oscuro por si la imagen es transparente) */}
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-14 w-14 rounded-sm object-cover border border-zinc-800 bg-zinc-950"
                src={imagenProducto}
                alt={product.name}
                onError={(e) => { e.target.src = "/products/default.jpg"; }} // Si falla, pone una por defecto
              />
            </div>
            {/* Textos */}
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-white uppercase tracking-tight">
                {product.name}
              </p>
              <p className="mt-1 text-xs text-zinc-400 uppercase">
                Talla: {sizeSelected} <span className="mx-1">•</span> Cant: 1
              </p>
              <p className="mt-1 text-sm font-black text-white">
                ${product.price?.toLocaleString("es-CL")}
              </p>
            </div>
          </div>
        </div>
        {/* Botón para cerrar */}
        <div className="flex border-l border-zinc-800">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    ), { duration: 4000 });
  };

  return (
    <div className="flex flex-col h-full">
      
      {/* 🔗 ENLACE HACIA EL PRODUCTO */}
      <Link href={`/producto/${product.id}`} className="group block cursor-pointer flex-grow">
        <div className="relative aspect-[3/4] bg-zinc-950 overflow-hidden mb-4 border border-zinc-900 group-hover:border-zinc-800 transition-colors">
          <img
            src={imagenProducto}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
            onError={(e) => { e.target.src = "/products/default.jpg"; }} 
          />
          {product.status === "Agotado" && (
            <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest border border-black/10 shadow-sm z-10">
              Agotado
            </div>
          )}
        </div>

        <div className="flex flex-col items-start text-left mb-4">
          <h3 className="text-sm md:text-base font-extrabold uppercase tracking-tight text-white mb-1 group-hover:text-gray-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-[10px] font-medium text-gray-500 mb-2 uppercase tracking-[0.2em]">
            {product.category}
          </p>
          <p className="text-sm md:text-base font-medium text-white">
            ${product.price ? product.price.toLocaleString('es-CL') : '0'}
          </p>
        </div>
      </Link>

      {/* ⚡ ZONA DINÁMICA DE COMPRA */}
      <div className="mt-auto relative h-12">
        {/* ESTADO 1: Botón Inicial "AGREGAR" */}
        {!showSizes ? (
          <button
            type="button"
            onClick={handleIntentarAgregar}
            disabled={product.status === "Agotado"}
            className="absolute inset-0 w-full h-full bg-white text-black border border-white text-[11px] font-bold uppercase tracking-widest flex items-center justify-center hover:bg-zinc-200 transition-all duration-300 disabled:opacity-30 disabled:hover:bg-white"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            {product.status === "Agotado" ? "Agotado" : "AGREGAR"}
          </button>
        ) : (
          /* ESTADO 2: Fila de Botones de Tallas */
          <div className="absolute inset-0 w-full h-full flex gap-1 animate-in fade-in zoom-in duration-200">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => agregarAlCarritoFinal(e, size)}
                className="flex-1 bg-zinc-900 border border-zinc-700 text-white text-xs font-bold hover:bg-white hover:text-black hover:border-white transition-colors"
              >
                {size}
              </button>
            ))}
            {/* Botoncito para cancelar y volver a "AGREGAR" */}
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowSizes(false); }}
              className="px-3 bg-black border border-zinc-800 text-zinc-500 hover:text-white transition-colors text-xs"
            >
              ✕
            </button>
          </div>
        )}
      </div>

    </div>
  );
}