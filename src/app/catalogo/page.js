"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { mockProducts } from "../../data/mockData";
import ProductCard from "../../components/ProductCard";

// 1. EL COMPONENTE QUE HACE EL TRABAJO (El que lee la URL)
function CatalogoContent() {
  const searchParams = useSearchParams();
  const categoriaFiltrada = searchParams.get("categoria");

  const productosAMostrar = categoriaFiltrada
    ? mockProducts.filter(p => p.category === categoriaFiltrada)
    : mockProducts;

  const titulos = {
    beanie: "Beanies",
    trucker: "Trucker Hats",
  };

  return (
    <>
      <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-16 border-b border-gray-900 pb-6">
        {categoriaFiltrada ? titulos[categoriaFiltrada] : "Colección Completa"}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
        {productosAMostrar.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}

// 2. LA PÁGINA PRINCIPAL QUE ENVUELVE TODO EN SUSPENSE
export default function CatalogoPage() {
  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Aquí está la magia que pide Vercel */}
        <Suspense fallback={<div className="text-xl font-bold uppercase tracking-widest text-gray-500">Cargando colección...</div>}>
          <CatalogoContent />
        </Suspense>

      </div>
    </div>
  );
}