"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../../../lib/firebase"; 
import ProductCard from "../../../components/ProductCard";
import { useCart } from "../../../context/CartContext";

export default function ProductPage() {
  const params = useParams();
  const { id } = params;
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (!id) return;
    const fetchProductData = async () => {
      try {
        // 🔥 Corregido: Ahora apunta a "productos"
        const docRef = doc(db, "productos", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const prodData = { id: docSnap.id, ...data };
          setProduct(prodData);
          
          // 🔥 Corregido: Usa el campo "image" en vez de "imageUrl"
          setMainImage(data.image || "");

          // Auto-seleccionar talla si es única (ej: "U")
          if (data.sizes && data.sizes.length === 1) {
            setSelectedSize(data.sizes[0]);
          }

          // 🔥 Corregido: Cargar relacionados desde "productos"
          const q = query(collection(db, "productos"), limit(5));
          const querySnapshot = await getDocs(q);
          const related = [];
          querySnapshot.forEach((doc) => {
            if (doc.id !== id && related.length < 4) {
              related.push({ id: doc.id, ...doc.data() });
            }
          });
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error cargando producto:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Por favor, selecciona una talla antes de agregar al carrito.");
      return;
    }
    addToCart(product, selectedSize);
    alert("¡Prenda agregada al carrito con éxito!");
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><p className="text-white text-xs uppercase tracking-widest font-bold animate-pulse">Cargando prenda...</p></div>;
  if (!product) return <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4"><p className="text-white text-xl font-bold uppercase tracking-widest">Producto no encontrado</p></div>;

  return (
    <div className="min-h-screen bg-black w-full pt-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-10 lg:gap-16 mb-24">
          {/* GALERÍA */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="w-full aspect-[4/5] bg-zinc-950 border border-zinc-900 overflow-hidden">
              {mainImage ? (
                <img src={mainImage} alt={product.name} className="w-full h-full object-cover object-center" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-800 font-black tracking-widest text-sm uppercase">DEPT STUDIO</div>
              )}
            </div>
            
            {/* Miniaturas de imágenes (solo se muestran si hay una imagen válida) */}
            {product.image && (
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                {[product.image].map((img, idx) => (
                  <button key={idx} onClick={() => setMainImage(img)} className={`w-20 h-24 flex-shrink-0 bg-zinc-950 border ${mainImage === img ? 'border-white' : 'border-zinc-900'}`}>
                    <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETALLES */}
          <div className="w-full md:w-1/2 flex flex-col pt-2 lg:pt-8 text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-white mb-2">{product.name}</h1>
            <p className="text-xl font-medium text-white mb-4">${product.price?.toLocaleString('es-CL')}</p>
            <p className="text-sm text-gray-400 mb-8 font-medium">Los gastos de envío se calculan en la pantalla de pagos.</p>

            {/* SELECTOR DE TALLA DINÁMICO */}
            <div className="mb-8">
              <label htmlFor="size" className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Talla</label>
              <div className="relative">
                <select 
                  id="size" 
                  value={selectedSize} 
                  onChange={(e) => setSelectedSize(e.target.value)} 
                  className="w-full bg-black border border-zinc-800 text-white py-4 px-4 focus:outline-none focus:border-white transition-colors appearance-none cursor-pointer text-sm uppercase font-bold tracking-widest"
                >
                  <option value="" disabled>Selecciona una talla</option>
                  {/* 🔥 Corregido: Mapea las tallas reales desde el array de tu Firebase */}
                  {product.sizes && product.sizes.map((size) => (
                    <option key={size} value={size}>Talla {size}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-12">
              <button onClick={handleAddToCart} className="w-full border border-white bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
                Agregar al carrito
              </button>
              <Link href="/checkout" className="w-full text-center bg-white text-black py-4 text-sm font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all duration-300">
                Ir al Checkout
              </Link>
            </div>

            <div className="text-gray-400 text-sm space-y-4 leading-relaxed font-medium border-t border-zinc-900 pt-6">
              {product.description ? <p className="whitespace-pre-line">{product.description}</p> : <p>Prenda diseñada bajo los más altos estándares de calidad urbana de DEPT STUDIO.</p>}
            </div>
          </div>
        </div>

        {/* SECCIÓN DE PRODUCTOS RELACIONADOS */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-zinc-900 pt-16">
            <h2 className="text-xl font-black uppercase tracking-widest text-white mb-8 text-left">Te podría interesar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}