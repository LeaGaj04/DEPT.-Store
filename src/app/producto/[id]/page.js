"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../../../lib/firebase"; 
import ProductCard from "../../../components/ProductCard";
// 1. IMPORTAMOS EL CARRITO
import { useCart } from "../../../context/CartContext";

export default function ProductPage() {
  const params = useParams();
  const { id } = params;

  // 2. EXTRAEMOS LA FUNCIÓN ADDTOCART
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
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({ id: docSnap.id, ...data });
          setMainImage(data.imageUrl);

          const q = query(collection(db, "products"), limit(5));
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

  // 3. FUNCIÓN PARA MANEJAR EL CLIC EN AGREGAR
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
            <div className="w-full aspect-[4/5] bg-gray-900 overflow-hidden">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover object-center" />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {[product.imageUrl, product.imageUrl, product.imageUrl].map((img, idx) => (
                <button key={idx} onClick={() => setMainImage(img)} className={`w-20 h-24 flex-shrink-0 bg-gray-900 border ${mainImage === img ? 'border-white' : 'border-transparent'}`}>
                  <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          {/* DETALLES */}
          <div className="w-full md:w-1/2 flex flex-col pt-2 lg:pt-8 text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-white mb-2">{product.name}</h1>
            <p className="text-xl font-medium text-white mb-4">${product.price?.toLocaleString('es-CL')}</p>
            <p className="text-sm text-gray-400 mb-8 font-medium">Los gastos de envío se calculan en la pantalla de pagos.</p>

            {/* SELECTOR DE TALLA */}
            <div className="mb-8">
              <label htmlFor="size" className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Talla</label>
              <div className="relative">
                <select id="size" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="w-full bg-black border border-gray-700 text-white py-4 px-4 focus:outline-none focus:border-white transition-colors appearance-none cursor-pointer">
                  <option value="" disabled>Selecciona una talla</option>
                  <option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-12">
              {/* 4. CONECTAMOS EL BOTÓN AL EVENTO */}
              <button onClick={handleAddToCart} className="w-full border border-white bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                Agregar al carrito
              </button>
              <Link href="/carrito" className="w-full text-center bg-white text-black py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                Ver carrito
              </Link>
            </div>

            <div className="text-gray-400 text-sm space-y-4 leading-relaxed font-medium">
              {product.description ? <p className="whitespace-pre-line">{product.description}</p> : <p>Prenda diseñada con materiales de primera calidad...</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}