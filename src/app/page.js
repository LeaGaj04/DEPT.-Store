import Link from "next/link";
import Image from "next/image";
import ProductCard from "../components/ProductCard";
import { mockProducts } from "../data/mockData";

export default function Home() {
  // Separamos de forma automática la data para el Inicio
  const beanies = mockProducts.filter(p => p.category === "beanie").slice(0, 4);
  const truckers = mockProducts.filter(p => p.category === "trucker").slice(0, 4);

  return (
    <div className="flex flex-col w-full bg-black min-h-screen">

      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/Gorros1.jpg"
          alt="DEPT. Streetwear Hero"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/40 z-0" />
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-6 drop-shadow-xl select-none">
            D<span className="text-red-600">E</span>PT. Streetwear
          </h1>
          <Link
            href="/catalogo"
            className="bg-white text-black px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300 shadow-lg"
          >
            Ver Colección
          </Link>
        </div>
      </section>

      {/* 2. SECCIÓN: BEANIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">Beanies</h2>
            <p className="text-gray-400 text-xs md:text-sm mt-1 font-medium uppercase tracking-wider">Gorros esenciales de punto pesado</p>
          </div>
          <Link href="/catalogo?categoria=beanie" className="text-sm font-medium underline uppercase tracking-wide text-gray-400 hover:text-white transition-colors">
            Ver todos los Beanies
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
          {beanies.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. SECCIÓN: TRUCKER HATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">Trucker Hats</h2>
            <p className="text-gray-400 text-xs md:text-sm mt-1 font-medium uppercase tracking-wider">Gorras estructuradas con malla urbana</p>
          </div>
          <Link href="/catalogo?categoria=trucker" className="text-sm font-medium underline uppercase tracking-wide text-gray-400 hover:text-white transition-colors">
            Ver todas las Truckers
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
          {truckers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. SECCIÓN DE MARCA */}
      <section className="bg-white py-24 border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 text-black">
            Hecho para la calle
          </h2>
          <p className="text-black font-medium text-lg leading-relaxed">
            Diseñamos prendas con cortes oversize, materiales pesados de alta calidad y una estética minimalista.
          </p>
        </div>
      </section>

    </div>
  );
}