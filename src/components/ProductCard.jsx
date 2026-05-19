import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <Link href={`/producto/${product.id}`} className="group block cursor-pointer">
      
      {/* 1. CONTENEDOR DE LA IMAGEN */}
      <div className="relative aspect-[3/4] bg-gray-900 overflow-hidden mb-5">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        
        {/* Etiqueta de Sold Out */}
        {product.status === "Agotado" && (
          <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest border border-black/10 shadow-sm">
            Agotado
          </div>
        )}
      </div>

      {/* 2. INFORMACIÓN DEL PRODUCTO (Colores corregidos para fondo oscuro) */}
      <div className="flex flex-col items-start text-left">
        {/* text-white para el nombre del producto */}
        <h3 className="text-sm md:text-base font-extrabold uppercase tracking-tight text-white mb-1">
          {product.name}
        </h3>
        {/* text-gray-400 para la categoría */}
        <p className="text-[10px] font-medium text-gray-400 mb-2 uppercase tracking-[0.2em]">
          {product.category}
        </p>
        {/* text-white para el precio */}
        <p className="text-sm md:text-base font-medium text-white">
          ${product.price.toLocaleString('es-CL')}
        </p>
      </div>
      
    </Link>
  );
}