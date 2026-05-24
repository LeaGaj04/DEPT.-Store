"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "../../lib/firebase"; // Ajusta la ruta según tu estructura
import { collection, getDocs } from "firebase/firestore";

// Componente interno que maneja la lógica del catálogo
function CatalogoContent() {
  const searchParams = useSearchParams();
  // Capturamos el parámetro "categoria" de la URL (ej: /catalogo?categoria=beanie)
  const categoriaUrl = searchParams.get("categoria");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "products"));
        const allProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // MAPEO CLAVE: Vinculamos lo que viene de tu Navbar con las categorías de Firebase
        // Si en tu Navbar el href dice '?categoria=beanie', aquí lo transformamos a 'Beanies' (como lo guarda el admin)
        let categoriaFormateada = "";
        if (categoriaUrl) {
          const urlLower = categoriaUrl.toLowerCase();
          if (urlLower.includes("polera")) categoriaFormateada = "Poleras";
          else if (urlLower.includes("beanie")) categoriaFormateada = "Beanies";
          else if (urlLower.includes("trucker") || urlLower.includes("hat")) categoriaFormateada = "Trucker Hats";
          else if (urlLower.includes("drop")) categoriaFormateada = "Drop";
        }

        // Si hay una categoría seleccionada en la URL, filtramos. Si no, mostramos todo.
        if (categoriaFormateada) {
          const filtered = allProducts.filter(p => p.category === categoriaFormateada);
          setProducts(filtered);
        } else {
          // Si entran a /catalogo a secas, ordenamos por fecha (lo más nuevo primero)
          const sorted = allProducts.sort((a, b) => {
            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return timeB - timeA;
          });
          setProducts(sorted);
        }
      } catch (error) {
        console.error("Error cargando productos del catálogo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoriaUrl]); // Cada vez que el cliente cambie de categoría en el menú, este useEffect se vuelve a ejecutar

  // Determinar el título dinámico de la página
  const getTitle = () => {
    if (!categoriaUrl) return "Todos los Productos";
    if (categoriaUrl.toLowerCase().includes("polera")) return "Poleras";
    if (categoriaUrl.toLowerCase().includes("beanie")) return "Beanies";
    if (categoriaUrl.toLowerCase().includes("trucker")) return "Trucker Hats";
    return categoriaUrl;
  };

  if (loading) return <div className="p-20 text-center uppercase tracking-widest text-xs text-white bg-black min-h-screen">Cargando colección...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-white bg-black min-h-screen">
      {/* Título Dinámico */}
      <div className="mb-10 border-b border-zinc-900 pb-4 flex justify-between items-end">
        <h1 className="text-2xl font-black uppercase tracking-tighter">{getTitle()}</h1>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
          {products.length} {products.length === 1 ? "Artículo" : "Artículos"}
        </span>
      </div>
      
      {/* Grid Minimalista de Productos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className="overflow-hidden bg-zinc-900 aspect-square relative mb-4">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.status === "Agotado" && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-wider">SOLD OUT</span>
              )}
            </div>
            <div className="flex justify-between items-start">
              <h3 className="text-xs font-black uppercase tracking-tight text-white">{product.name}</h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1">${product.price.toLocaleString('es-CL')}</p>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-zinc-500 text-xs uppercase tracking-widest text-center py-20">
          No se encontraron productos en esta sección.
        </p>
      )}
    </div>
  );
}

// En Next.js (App Router), cualquier componente que use useSearchParams() 
// DEBE estar envuelto en un componente <Suspense> para evitar errores durante la build.
export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center uppercase tracking-widest text-xs text-white bg-black min-h-screen">Cargando Catálogo...</div>}>
      <CatalogoContent />
    </Suspense>
  );
}

// Comentario para git push