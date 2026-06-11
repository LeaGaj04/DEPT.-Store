"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import InstagramMarquee from "../components/InstagramMarquee";
import { toast } from "react-hot-toast";

// Función blindada para leer SOLO las imágenes que realmente existen en tu carpeta public/products
const getImagePath = (product) => {
  const name = (product.name || "").toLowerCase();
  const category = (product.category || "").toLowerCase();

  if (name.includes('polera') || category.includes('polera')) return '/products/polera.jpg';
  if (name.includes('beanie') || category.includes('beanie')) return '/products/beanie.jpg';
  if (name.includes('trucker') || category.includes('trucker')) return '/products/trucker.jpg';

  if (product.image) return product.image;
  if (product.imageUrl) return product.imageUrl;

  return '';
};

// 👇 TARJETA DE PRODUCTO BLINDADA (SOPORTA ARRAYS Y MAPAS) 👇
function ProductCard({ product, isNew }) {
  const { addToCart } = useCart();
  const [showSizes, setShowSizes] = useState(false);
  const isAgotado = product.status === "Agotado";

  const imagenProducto = getImagePath(product);

  // 🔥 NORMALIZACIÓN DE TALLAS: Extrae una lista limpia de tallas válidas según el formato en DB
  const obtenerListaTallas = () => {
    if (!product.sizes) return [];
    
    // Si viene en formato Mapa de Firestore { S: 5, M: 0, L: 2 }
    if (typeof product.sizes === "object" && !Array.isArray(product.sizes)) {
      // Devolvemos solo las tallas que tengan stock real mayor a cero
      return Object.keys(product.sizes).filter(size => product.sizes[size] > 0);
    }
    
    // Si viene en formato Arreglo antiguo ["S", "M", "L"]
    if (Array.isArray(product.sizes)) {
      return product.sizes;
    }
    
    return [];
  };

  const listaTallasDisponibles = obtenerListaTallas();

  const handleIntentarAgregar = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isAgotado) return;

    // Si no tiene tallas asignadas o están vacías, se asume talla Única
    if (listaTallasDisponibles.length === 0) {
      agregarAlCarritoFinal(e, "U");
    } else {
      setShowSizes(true);
    }
  };

  const agregarAlCarritoFinal = (e, sizeSelected) => {
    e.stopPropagation();
    e.preventDefault();

    addToCart(product, sizeSelected);
    setShowSizes(false);

    toast.custom((t) => (
      <div
        className={`${t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          } transform transition-all duration-300 max-w-sm w-full bg-black border border-zinc-800 shadow-2xl flex pointer-events-auto z-[9999]`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-14 w-14 rounded-sm object-cover border border-zinc-800 bg-zinc-950"
                src={imagenProducto}
                alt={product.name}
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-white uppercase tracking-tight">
                {product.name}
              </p>
              <p className="mt-1 text-xs text-zinc-400 uppercase">
                Talla: {sizeSelected} <span className="mx-1">•</span> Cant: 1
              </p>
              <p className="mt-1 text-sm font-black text-white">
                ${product.price?.toLocaleString("es-CL")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-zinc-800">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    ), { duration: 4000 });
  };

  return (
    <div className="group flex flex-col h-full bg-zinc-950 p-3 border border-transparent hover:border-zinc-900 transition-colors">
      <Link href={`/producto/${product.id}`} className="block cursor-pointer flex-grow">
        <div className="overflow-hidden bg-zinc-900 aspect-square relative mb-4">
          <img
            src={imagenProducto}
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
          ${product.price ? product.price.toLocaleString('es-CL') : '0'}
        </p>
      </Link>

      {/* ⚡ ZONA DINÁMICA DE COMPRA MUTABLE */}
      <div className="mt-auto pt-2 h-10">
        {!showSizes ? (
          <button
            onClick={handleIntentarAgregar}
            disabled={isAgotado}
            className="w-full h-full bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-zinc-300 transition-colors flex items-center justify-center disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={14} className="mr-2" />
            {isAgotado ? "Sin Stock" : "Agregar"}
          </button>
        ) : (
          <div className="w-full h-full flex gap-1 animate-in fade-in zoom-in duration-200">
            {listaTallasDisponibles.map((size) => (
              <button
                key={size}
                onClick={(e) => agregarAlCarritoFinal(e, size)}
                className="flex-1 bg-zinc-900 border border-zinc-700 text-white text-[10px] font-bold hover:bg-white hover:text-black hover:border-white transition-colors"
              >
                {size}
              </button>
            ))}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowSizes(false); }}
              className="px-3 bg-black border border-zinc-800 text-zinc-500 hover:text-white transition-colors text-xs"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 👇 PÁGINA PRINCIPAL 👇
export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [beanies, setBeanies] = useState([]);
  const [truckers, setTruckers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        
        const allProducts = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const category = (data.category || "").toLowerCase();
          const name = (data.name || "").toLowerCase();

          // Limpiamos de forma segura las tallas de gorros para tratarlos directo como Talla Única
          if (
            category.includes("beanie") || name.includes("beanie") ||
            category.includes("trucker") || name.includes("trucker") ||
            category.includes("gorro")
          ) {
            data.sizes = [];
          }

          return { id: doc.id, ...data };
        });

        const sortedProducts = allProducts.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });

        setNewArrivals(sortedProducts.slice(0, 4));

        const filteredBeanies = sortedProducts.filter(p => p.category === "Beanies" || p.category === "beanies" || p.name.toLowerCase().includes("beanie"));
        setBeanies(filteredBeanies);

        const filteredTruckers = sortedProducts.filter(p => p.category === "Trucker Hats" || p.category === "Truckers" || p.category === "trucker" || p.name.toLowerCase().includes("trucker"));
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

      {/* ⚡ CINTA MARQUEE EN MOVIMIENTO */}
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