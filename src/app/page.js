"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase"; // Ajusta la ruta a tu archivo firebase.js
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [olderProducts, setOlderProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const allProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 1. Ordenamos de manera estricta por fecha: los más nuevos primero
        const sortedProducts = allProducts.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });

        // 2. Separación mágica: Los primeros 4 van a "Lo Nuevo"
        setNewArrivals(sortedProducts.slice(0, 4));

        // 3. Del producto 5 en adelante van a "Lo Viejo / Clásicos"
        setOlderProducts(sortedProducts.slice(4));

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
      {/* SECCIÓN 1: Banner Principal / Hero con tu foto de fondo */}
      <div className="relative h-[70vh] w-full bg-zinc-950 flex flex-col justify-center items-center text-center px-4 overflow-hidden border-b border-zinc-900">
        
        {/* 🔥 AQUÍ ESTÁ TU FOTO DE VUELTA: Cambia 'ruta_de_tu_imagen.jpg' por el nombre real de tu archivo en la carpeta public (ej: '/banner-hats.jpg') o la URL de la imagen */}
        <img 
          src="/Gorros1.jpg" 
          alt="DEPT Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 select-none pointer-events-none"
        />

        {/* Capa de degradado oscuro para que el título resalte al máximo */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black z-10" />
        
        {/* Contenido (Título y Botón) por encima de la foto */}
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

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        
        {/* SECCIÓN 2: EL NUEVO DROP (Los 4 más recientes de Firebase) */}
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
                <div key={product.id} className="group cursor-pointer">
                  <div className="overflow-hidden bg-zinc-900 aspect-square relative mb-4">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 right-2 bg-white text-black text-[9px] font-black uppercase px-2 py-0.5 tracking-wider">NEW</span>
                    {product.status === "Agotado" && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 tracking-wider">SOLD OUT</span>
                    )}
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-tight text-white">{product.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1">${product.price.toLocaleString('es-CL')}</p>
                </div>
              ))}
              {newArrivals.length === 0 && (
                <p className="col-span-full text-center text-zinc-500 text-xs py-10 uppercase tracking-widest">No hay productos creados por el admin todavía.</p>
              )}
            </div>
          )}
        </div>

        {/* SECCIÓN 3: CLÁSICOS DE LA TIENDA (Lo más antiguo de Firebase) */}
        {!loading && olderProducts.length > 0 && (
          <div>
            <div className="mb-8 border-b border-zinc-900 pb-4">
              <h2 className="text-xl font-black uppercase tracking-tight">Productos Anteriores</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {olderProducts.map((product) => (
                <div key={product.id} className="group cursor-pointer/ opacity-80 hover:opacity-100 transition-opacity">
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
                  <h3 className="text-xs font-bold uppercase tracking-tight text-zinc-300">{product.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1">${product.price.toLocaleString('es-CL')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}