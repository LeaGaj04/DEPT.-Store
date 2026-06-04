"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase"; 
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext"; 
import InstagramMarquee from "../components/InstagramMarquee"; 

const imagenesPorCategoria = {
  "Trucker Hats": "/products/trucker.jpg",
  "Beanies": "/products/beanie.jpg",
  "Poleras": "/products/polera.jpg",
};

function ProductCard({ product, isNew }) {
  const { addToCart } = useCart();
  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "Única";
  const isAgotado = product.status === "Agotado";

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product, defaultSize);
    alert(`¡${product.name} agregado al carrito! 🛒`);
  };

  const rutaImagenLocal = imagenesPorCategoria[product.category] || "/products/default.jpg";

  return (
    <div className="group flex flex-col h-full bg-zinc-950 p-3 border border-transparent hover:border-zinc-900 transition-colors">
      <Link href={`/producto/${product.id}`} className="block cursor-pointer flex-grow">
        <div className="overflow-hidden bg-zinc-900 aspect-square relative mb-4">
          <img
            src={rutaImagenLocal}
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

        <h3 className="text-xs font-black uppercase tracking-tight text-white truncate group-hover:text-zinc-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-zinc-400 mt-1 mb-4">
          ${product.price.toLocaleString('es-CL')}
        </p>
      </Link>

      <div className="mt-auto pt-2">
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

        const sortedProducts = allProducts.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });

        setNewArrivals(sortedProducts.slice(0, 4));

        const filteredBeanies = sortedProducts.filter(p => p.category === "Beanies" || p.category === "beanies");
        setBeanies(filteredBeanies);

        const filteredTruckers = sortedProducts.filter(p => p.category === "Trucker Hats" || p.category === "Truckers" || p.category === "trucker");
        setTruckers(filteredTruckers);

      } catch (error) {
        console.error("Error cargando productos en el Inicio:", error);
      } finally {
        // 🛠️ ¡CORREGIDO AQUÍ! Cambiado 'loading(false)' por 'setLoading(false)'
        setLoading(false); 
      }
    };

    fetchHomeProducts();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white w-full overflow-x-hidden">

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
            DE<span className="text-red-600">P</span>T. Store
          </h1>
          <Link
            href="/catalogo"
            className="mt-8 bg-white text-black font-black uppercase tracking-widest text-xs px-10 py-4 hover:bg-zinc-200 transition-all transform hover:scale-105 duration-300"
          >
            Ver Colección
          </Link>
        </div>
      </div>

      {/* BLOCK CON MARGEN CENTRADO SÓLO PARA "LO NUEVO" */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-6">
        <div>
          <div className="mb-8 border-b border-zinc-900 pb-4 flex justify-between items-end">
            <h2 className="text-xl font-black uppercase tracking-tight">Lo Nuevo</h2>
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
      </div>

      {/* ⚡ CINTA MARQUEE EN MOVIMIENTO: ¡Ahora con CSS e Inyecciones puras sin depender de Tailwind! */}
      <div style={{
        width: '100%',
        backgroundColor: '#000000',
        padding: '24px 0',
        overflow: 'hidden',
        borderTop: '1px solid #18181b',
        borderBottom: '1px solid #18181b',
        display: 'flex',
        userSelect: 'none'
      }}>
        {/* Inyectamos los keyframes para la animación infinita de forma nativa */}
        <style>{`
          @keyframes marqueeNativo {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <div style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: 'marqueeNativo 20s linear infinite'
        }}>
          {[...Array(12)].map((_, i) => (
            <span key={i} style={{
              fontSize: '2rem',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '-0.05em',
              color: '#ffffff',
              margin: '0 24px',
              display: 'inline-flex',
              alignItems: 'center'
            }}>
              Pronto nuevo drop <span style={{ marginLeft: '40px', color: '#dc2626' }}>★</span>
            </span>
          ))}
        </div>
      </div>

      {/* BANNER EDITORIAL COMPLETAMENTE FULL-WIDTH */}
      <div className="bg-white text-black w-full grid grid-cols-1 md:grid-cols-3 my-14 min-h-[450px] overflow-hidden">
        <div className="md:col-span-2 flex flex-col justify-center px-8 py-16 md:px-16 lg:px-24 text-left">
          <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-3">
            Colección Limitada
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 leading-none text-black">
            REDEFINIENDO EL <br />STREETWEAR ESENCIAL
          </h2>
          <p className="text-zinc-600 text-sm md:text-base max-w-xl mb-8 leading-relaxed">
            Nuestras prendas están diseñadas meticulosamente en Chile, buscando el equilibrio perfecto entre cortes relajados y materiales de alta durabilidad. Creado por y para la cultura urbana.
          </p>
          <div>
            <Link
              href="/catalogo"
              className="inline-block bg-black text-white text-xs font-black tracking-widest uppercase px-8 py-4 hover:bg-zinc-800 transition-colors"
            >
              Explorar el drop
            </Link>
          </div>
        </div>

        <div className="md:col-span-1 min-h-[350px] md:min-h-full bg-zinc-100 relative">
          <img
            src="https://i.pinimg.com/736x/7e/e1/13/7ee113259ef01010b268f8f26e30ea03.jpg"
            alt="Campaña Dept Studio"
            className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-750 ease-out"
          />
        </div>
      </div>

      {/* NUEVO BLOCK CON MARGEN CENTRADO PARA LAS COLECCIONES RESTANTES */}
      <div className="max-w-7xl mx-auto px-4 pb-16 space-y-24">
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

      <InstagramMarquee />
    </div>
  );
}