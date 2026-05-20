"use client";
import { useSearchParams } from "next/navigation";
import { mockProducts } from "../../data/mockData";
import ProductCard from "../../components/ProductCard";

export default function CatalogoPage() {
  const searchParams = useSearchParams();
  const categoriaFiltrada = searchParams.get("categoria"); // Captura lo que viene del Header

  // Filtramos la data de forma automática
  const productosAMostrar = categoriaFiltrada
    ? mockProducts.filter(p => p.category === categoriaFiltrada)
    : mockProducts;

  // Diccionario para cambiar el título de forma limpia
  const titulos = {
    beanie: "Beanies",
    trucker: "Trucker Hats",
  };

  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TÍTULO LIMPIO Y GIGANTE (Sin barras repetidas abajo) */}
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-16 border-b border-gray-900 pb-6">
          {categoriaFiltrada ? titulos[categoriaFiltrada] : "Colección Completa"}
        </h1>

        {/* GRID DE PRODUCTOS DIRECTO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
          {productosAMostrar.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </div>
  );
}