"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "../../lib/firebase"; 
import { collection, getDocs } from "firebase/firestore";
import ProductCard from "../../components/ProductCard";

function CatalogoContent() {
  const searchParams = useSearchParams();
  const categoriaFiltrada = searchParams.get("categoria");

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function obtenerProductosDeFirebase() {
      try {
        const querySnapshot = await getDocs(collection(db, "productos"));
        const listaProductos = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProductos(listaProductos);
      } catch (error) {
        console.error("Error al conectar con Firestore:", error);
      } finally {
        setCargando(false);
      }
    }
    obtenerProductosDeFirebase();
  }, []);

  const productosAMostrar = categoriaFiltrada
    ? productos.filter(p => p.category === categoriaFiltrada)
    : productos;

  const titulos = {
    beanie: "Beanies",
    trucker: "Trucker Hats",
  };

  if (cargando) {
    return (
      <div className="text-center my-32 text-xl font-bold uppercase tracking-widest text-gray-500 animate-pulse">
        Cargando colección real...
      </div>
    );
  }

  return (
    <>
      <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-16 border-b border-gray-900 pb-6">
        {categoriaFiltrada ? titulos[categoriaFiltrada] : "Colección Completa"}
      </h1>

      {productosAMostrar.length === 0 ? (
        <div className="text-center my-32 text-gray-500 uppercase tracking-widest text-sm">
          No hay productos disponibles en esta categoría actualmente.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
          {productosAMostrar.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}

export default function CatalogoPage() {
  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div className="text-center my-32 text-xl font-bold uppercase tracking-widest text-gray-500">
            Iniciando catálogo...
          </div>
        }>
          <CatalogoContent />
        </Suspense>
      </div>
    </div>
  );
}