"use client";
import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Catalogo() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Conexión a Firebase para traer los productos reales
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(list);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    // bg-black asegura que toda la página sea oscura
    <div className="min-h-screen bg-black w-full pt-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO DEL CATÁLOGO (Colores en blanco) */}
        <div className="mb-12 border-b border-gray-800 pb-6">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
            Colección Completa
          </h1>
          <p className="text-gray-400 text-sm mt-2 font-medium tracking-wide">
            {products.length} Productos encontrados
          </p>
        </div>

        {/* GRILLA DE PRODUCTOS */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-white text-xs uppercase tracking-widest font-bold animate-pulse">
              Cargando el Drop...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-8">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="text-gray-500 text-sm uppercase col-span-full text-center py-10">
                No hay productos disponibles por ahora.
              </p>
            )}
          </div>
        )}
        
      </div>
    </div>
  );
}