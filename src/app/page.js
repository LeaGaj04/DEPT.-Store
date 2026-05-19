import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { mockProducts } from "../data/mockData";

export default function Home() {
  return (
    // Añadimos bg-black aquí para que el fondo general sea negro
    <div className="flex flex-col w-full bg-black min-h-screen">

      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[70vh] bg-gray-900 flex items-center justify-center overflow-hidden">
        {/* Imagen de fondo (Placeholder) */}
        <img
          src="https://images.unsplash.com/photo-1511511450040-677116ff389e?auto=format&fit=crop&q=80&w=2000"
          alt="DEPT Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 drop-shadow-lg">
            DEPT. Streetwear
          </h1>
          <Link
            href="/catalogo"
            className="bg-white text-black px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-300 transition-colors duration-300"
          >
            Ver Colección
          </Link>
        </div>
      </section>

      {/* 2. NUEVO DROP (Fondo negro heredado, letras blancas) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex justify-between items-end mb-8">
          {/* Cambiamos text-black a text-white */}
          <h2 className="text-2xl font-bold uppercase tracking-tight text-white">Nuevo Drop</h2>
          {/* Cambiamos el enlace a un gris claro que se ilumine a blanco al pasar el mouse */}
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

      {/* 3. SECCIÓN DE MARCA (Fondo blanco, letras negras) */}
      <section className="bg-white py-24 border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 text-black">
            Hecho para la calle
          </h2>
          {/* Usamos text-black para que sea un negro 100% puro sobre el fondo blanco */}
          <p className="text-black font-medium text-lg leading-relaxed">
            Diseñamos prendas con cortes oversize, materiales pesados de alta calidad y una estética minimalista.
            No seguimos tendencias, creamos básicos urbanos que duran toda la vida.
          </p>
        </div>
      </section>

    </div>
  );
}