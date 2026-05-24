"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase"; // Ajusta la ruta si es necesario
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext"; // Importamos tu carrito

// ------------------------------------------------------------------
// COMPONENTE: Tarjeta individual limpia con botón directo
// ------------------------------------------------------------------
function ProductCard({ product, isNew }) {
  const { addToCart } = useCart();
  
  // Tomamos la primera talla automáticamente (ideal para tus gorros "Talla Única")
  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "Única";
  const isAgotado = product.status === "Agotado";

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    addToCart(product, defaultSize);
    alert(`¡${product.name} agregado al carrito! 🛒`);
  };

  return (
    <div className="group flex flex-col h-full bg-zinc-950 p-3 border border-transparent hover:border-zinc-900 transition-colors">
      <div className="overflow-hidden bg-zinc-900 aspect-square relative mb-4">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isAgotado ? 'opacity-50 grayscale' : ''}`}
        />
        {isNew && !isAgotado && (
          <span className="absolute top-2 right-2 bg-white text-black text-[9px] font-black uppercase px-2 py-0.5 tracking-wider">NEW</span>
        )}
        {isAgotado && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-wider">SOLD OUT</span>
        )}
      </div>
      
      <h3 className="text-xs font-black uppercase tracking-tight text-white truncate">{product.name}</h3>
      <p className="text-xs text-zinc-400 mt-1 mb-4">${product.price.toLocaleString('es-CL')}</p>

      <div className="mt-auto">
        <button 
          onClick={handleAddToCart}
          disabled={isAgotado}
          className="w-full bg-white text-black py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-300 transition-colors flex items-center justify-center disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
        >
          <ShoppingBag size={14} className="mr-2" />
          {isAgotado ? "Sin Stock" : "Agregar"}
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// COMPONENTE PRINCIPAL HOMEPAGE
// ------------------------------------------------------------------
export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [beanies, setBeanies] = useState([]);
  const [truckers, setTruckers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const allProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Ordenamos por fecha (más nuevos primero)
        const sortedProducts = allProducts.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });

        // 1. El Último Drop (Los 4 más nuevos de toda la tienda)
        setNewArrivals(sortedProducts.slice(0, 4));

        // 2. Filtrar sección de Beanies (Filtra por la categoría guardada en tu panel)
        // Nota: Asegúrate de que coincida con el nombre exactos que usas al crear el producto (ej: "Beanies")
        const filteredBeanies = sortedProducts.filter(p => p.category === "Beanies" || p.category === "beanies");
        setBeanies(filteredBeanies);

        // 3. Filtrar sección de Trucker Hats
        const filteredTruckers = sortedProducts.filter(p => p.category === "Trucker Hats" || p.category === "Truckers" || p.category === "trucker");
        setTruckers(filteredTruckers);

      } catch (error) {
        console.error("Error cargando productos en el Inicio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeProducts();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white">
      
      {/* SECCIÓN 1: Banner Principal */}
      <div className="relative h-[70vh] w-full bg-zinc-950 flex flex-col justify-center items-center text-center px-4 overflow-hidden border-b border-zinc-900">
        <img 
          src="/Gorros1.jpg" 
          alt="DEPT Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black z-10" />
        <div className="relative z-20 flex flex-col items-center">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase text-white">
            DE<span className="text-red-600">P</span>T.STREETWEAR
          </h1>
          <Link 
            href="/catalogo" 
            className="mt-8 bg-white text-black font-black uppercase tracking-widest text-xs px-10 py-4 hover:bg-zinc-200 transition-all transform hover:scale-105 duration-300"
          >
            Ver Colección
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-24">
        
        {/* SECCIÓN 2: ÚLTIMO DROP (Lo más nuevo en general) */}
        <div>
          <div className="mb-8 border-b border-zinc-900 pb-4 flex justify-between items-end">
            <h2 className="text-xl font-black uppercase tracking-tight">Último Drop / Lo Nuevo</h2>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Recién Llegado</span>
          </div>

          {loading ? (
            <div className="text-center py-10 text-xs text-zinc-500 uppercase tracking-widest">Cargando novedades...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} isNew={true} />
              ))}
              {newArrivals.length === 0 && (
                <p className="col-span-full text-center text-zinc-500 text-xs py-10 uppercase tracking-widest">No hay productos en el último drop.</p>
              )}
            </div>
          )}
        </div>

        {/* SECCIÓN 3: APARTADO DE BEANIES */}
        {!loading && beanies.length > 0 && (
          <div>
            <div className="mb-8 border-b border-zinc-900 pb-4 flex justify-between items-end">
              <h2 className="text-xl font-black uppercase tracking-tight">Colección Beanies</h2>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Gorros de Lana</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {beanies.map((product) => (
                <ProductCard key={product.id} product={product} isNew={false} />
              ))}
            </div>
          </div>
        )}

        {/* SECCIÓN 4: APARTADO DE TRUCKER HATS */}
        {!loading && truckers.length > 0 && (
          <div>
            <div className="mb-8 border-b border-zinc-900 pb-4 flex justify-between items-end">
              <h2 className="text-xl font-black uppercase tracking-tight">Colección Trucker Hats</h2>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Gorras Trucker</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {truckers.map((product) => (
                <ProductCard key={product.id} product={product} isNew={false} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}