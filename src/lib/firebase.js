"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "../../lib/firebase"; // ← Importa la base de datos de tu archivo de configuración
import { collection, getDocs } from "firebase/firestore";
import ProductCard from "../../components/ProductCard";

// 1. EL COMPONENTE QUE HACE EL TRABAJO (Lee la URL y descarga de Firebase)
function CatalogoContent() {
  const searchParams = useSearchParams();
  const categoriaFiltrada = searchParams.get("categoria");

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function obtenerProductosDeFirebase() {
      try {
        // IMPORTANTE: Cambia "productos" por el nombre exacto de tu colección en Firestore
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

  // Filtramos la lista que bajó de Firebase según la categoría seleccionada arriba
  const productosAMostrar = categoriaFiltrada
    ? productos.filter(p => p.category === categoriaFiltrada)
    : productos;

  // Diccionario para los títulos elegantes de tu marca
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
      {/* TÍTULO DINÁMICO */}
      <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-16 border-b border-gray-900 pb-6">
        {categoriaFiltrada ? titulos[categoriaFiltrada] : "Colección Completa"}
      </h1>

      {/* DETECTOR DE STOCK VACÍO */}
      {productosAMostrar.length === 0 ? (
        <div className="text-center my-32 text-gray-500 uppercase tracking-widest text-sm">
          No hay productos disponibles en esta categoría actualmente.
        </div>
      ) : (
        /* GRID DE PRODUCTOS REALES */
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
          {productosAMostrar.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}

// 2. LA PÁGINA PRINCIPAL QUE EVUELVE TODO EN SUSPENSE (Para que Vercel no reclame)
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