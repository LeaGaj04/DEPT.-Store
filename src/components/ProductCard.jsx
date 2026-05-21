"use client";
import Link from 'next/link';
import { useCart } from '../context/CartContext'; // Ajusta la ruta si tu carpeta context está en otro lugar

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleQuickAdd = (e) => {
    // 🔥 Crucial: evita que el clic en el botón active el Link a la página del producto
    e.preventDefault(); 
    
    if (product.status === "Agotado") return;

    // Detecta automáticamente la primera talla del array en Firebase, si no tiene usa "U" (Talla Única)
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "U";
    
    addToCart(product, defaultSize);
  };

  return (
    <Link href={`/producto/${product.id}`} className="group block cursor-pointer">
      
      {/* 1. CONTENEDOR DE LA IMAGEN */}
      <div className="relative aspect-[3/4] bg-zinc-950 overflow-hidden mb-4 border border-zinc-900 group-hover:border-zinc-800 transition-colors">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
        ) : (
          /* Marcador de posición elegante por si aún no pones el link de la foto en Firebase */
          <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-800 font-black tracking-[0.25em] text-xs uppercase select-none">
            DEPT STUDIO
          </div>
        )}
        
        {/* Etiqueta de Sold Out */}
        {product.status === "Agotado" && (
          <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest border border-black/10 shadow-sm z-10">
            Agotado
          </div>
        )}
      </div>

      {/* 2. INFORMACIÓN DEL PRODUCTO */}
      <div className="flex flex-col items-start text-left mb-4">
        <h3 className="text-sm md:text-base font-extrabold uppercase tracking-tight text-white mb-1 group-hover:text-gray-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-[10px] font-medium text-gray-500 mb-2 uppercase tracking-[0.2em]">
          {product.category === 'trucker' ? 'Trucker Hat' : product.category === 'beanie' ? 'Beanie' : product.category}
        </p>
        <p className="text-sm md:text-base font-medium text-white">
          ${product.price ? product.price.toLocaleString('es-CL') : '0'}
        </p>
      </div>

      {/* 3. BOTÓN DE COMPRA RÁPIDA */}
      <button
        type="button"
        onClick={handleQuickAdd}
        disabled={product.status === "Agotado"}
        className="w-full bg-transparent border border-zinc-800 text-white text-[11px] font-bold uppercase tracking-widest py-3 hover:bg-white hover:text-black hover:border-white transition-all duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white disabled:hover:border-zinc-800"
      >
        {product.status === "Agotado" ? "Agotado" : "Añadir rápido +"}
      </button>
      
    </Link>
  );
}