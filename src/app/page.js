import Link from "next/link";
import Image from "next/image"; // Importamos el optimizador de imágenes de Next.js
import ProductCard from "../components/ProductCard";
import { mockProducts } from "../data/mockData";

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-black min-h-screen">

      {/* 1. HERO SECTION (Totalmente inmersivo de borde a borde) */}
      <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">

        {/* Tu imagen de fondo optimizada */}
        <Image
          src="/Gorros1.jpg" // Ruta a tu foto en la carpeta public
          alt="DEPT. Streetwear Hero"
          fill // Hace que ocupe todo el contenedor
          className="object-cover object-center" // Se estira de borde a borde sin deformarse
          priority // Le dice a Next.js que la cargue de inmediato
        />

        {/* Capa oscura sutil encima de la foto para que el texto blanco resalte perfecto */}
        <div className="absolute inset-0 bg-black/40 z-0" />

        {/* Contenido encima de la imagen */}
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

      {/* 2. NUEVO DROP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-white">Nuevo Drop</h2>
          <Link href="/catalogo" className="text-sm font-medium underline uppercase tracking-wide text-gray-400 hover:text-white transition-colors">
            Ver todo
          </Link>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. SECCIÓN DE MARCA */}
      <section className="bg-white py-24 border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 text-black">
            Hecho para la calle
          </h2>
          <p className="text-black font-medium text-lg leading-relaxed">
            Diseñamos prendas con cortes oversize, materiales pesados de alta calidad y una estética minimalista.
            No seguimos tendencias, creamos básicos urbanos que duran toda la vida.
          </p>
        </div>
      </section>

    </div>
  );
}