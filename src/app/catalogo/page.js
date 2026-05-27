"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link"; // 🔥 1. AGREGAMOS LINK AQUÍ
import { db } from "../../lib/firebase"; 
import { collection, getDocs } from "firebase/firestore";

// 1. IMPORTAMOS EL CARRITO Y EL ÍCONO
import { useCart } from "../../context/CartContext"; 
import { ShoppingBag } from "lucide-react";

// 2. MAPEAMOS LAS CATEGORÍAS A TUS FOTOS LOCALES
const imagenesPorCategoria = {
  "Trucker Hats": "/products/trucker.jpg",
  "Beanies": "/products/beanie.jpg",
  "Poleras": "/products/polera.jpg",
};

// Componente interno que maneja la lógica del catálogo
function CatalogoContent() {
  const searchParams = useSearchParams();
  const categoriaUrl = searchParams.get("categoria");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // EXTRAEMOS LA FUNCIÓN DEL CARRITO
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "products"));
        const allProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        let categoriaFormateada = "";
        if (categoriaUrl) {
          const urlLower = categoriaUrl.toLowerCase();
          if (urlLower.includes("polera")) categoriaFormateada = "Poleras";
          else if (urlLower.includes("beanie")) categoriaFormateada = "Beanies";
          else if (urlLower.includes("trucker") || urlLower.includes("hat")) categoriaFormateada = "Trucker Hats";
          else if (urlLower.includes("drop")) categoriaFormateada = "Drop";
        }

        if (categoriaFormateada) {
          const filtered = allProducts.filter(p => p.category === categoriaFormateada);
          setProducts(filtered);
        } else {
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
  }, [categoriaUrl]); 

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
        {products.map((product) => {
          const rutaImagenLocal = imagenesPorCategoria[product.category] || "/products/default.jpg";
          const isAgotado = product.status === "Agotado";

          return (
            // 🔥 2. CAMBIAMOS EL DIV POR UN LINK PARA QUE CONECTE CON EL PRODUCTO 🔥
            <Link 
              href={`/producto/${product.id}`} 
              key={product.id} 
              className="group flex flex-col h-full bg-zinc-950 p-3 border border-transparent hover:border-zinc-900 transition-colors cursor-pointer"
            >
              
              <div className="overflow-hidden bg-zinc-900 aspect-square relative mb-4">
                <img 
                  src={rutaImagenLocal} 
                  alt={product.name} 
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isAgotado ? 'opacity-50 grayscale' : ''}`}
                />
                {isAgotado && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-wider">SOLD OUT</span>
                )}
              </div>
              
              <h3 className="text-xs font-black uppercase tracking-tight text-white truncate">{product.name}</h3>
              <p className="text-xs text-zinc-400 mt-1 mb-4">${product.price ? product.price.toLocaleString('es-CL') : '0'}</p>

              <div className="mt-auto">
                <button 
                  onClick={(e) => {
                    e.preventDefault(); 
                    e.stopPropagation(); // 🔥 3. ESTO EVITA QUE AL AGREGAR AL CARRITO TE LLEVE A LA OTRA PÁGINA 🔥
                    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "Única";
                    addToCart(product, defaultSize);
                    alert(`¡${product.name} agregado al carrito! 🛒`);
                  }}
                  disabled={isAgotado}
                  className="w-full bg-white text-black py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-300 transition-colors flex items-center justify-center disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={14} className="mr-2" />
                  {isAgotado ? "Sin Stock" : "Agregar"}
                </button>
              </div>
              
            </Link>
          );
        })}
      </div>

      {products.length === 0 && (
        <p className="text-zinc-500 text-xs uppercase tracking-widest text-center py-20">
          No se encontraron productos en esta sección.
        </p>
      )}
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center uppercase tracking-widest text-xs text-white bg-black min-h-screen">Cargando Catálogo...</div>}>
      <CatalogoContent />
    </Suspense>
  );
}