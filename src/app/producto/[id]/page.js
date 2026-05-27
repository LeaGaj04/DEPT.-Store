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
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const prodData = { id: docSnap.id, ...data };
          setProduct(prodData);
          setMainImage(data.image || "");

          if (data.sizes && data.sizes.length === 1) {
            setSelectedSize(data.sizes[0]);
          }

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

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Por favor, selecciona una talla antes de agregar al carrito.");
      return;
    }
    addToCart(product, selectedSize);
    alert("¡Prenda agregada al carrito con éxito!");
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><p className="text-black text-xs uppercase tracking-widest font-bold animate-pulse">Cargando prenda...</p></div>;
  if (!product) return <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4"><p className="text-black text-xl font-bold uppercase tracking-widest">Producto no encontrado</p></div>;

  return (
    <div className="min-h-screen bg-white w-full text-black pt-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-24">
          
          {/* COLUMNA IZQUIERDA: Galería de Imágenes */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Miniaturas */}
            {product.image && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:w-24 shrink-0 hide-scrollbar">
                {[product.image].map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setMainImage(img)}
                    className={`w-20 h-24 md:w-full md:h-32 flex-shrink-0 bg-gray-100 border-2 transition-all ${mainImage === img ? 'border-black' : 'border-transparent'}`}
                  >
                    <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            
            {/* Imagen Principal Grande */}
            <div className="flex-1 bg-gray-100 aspect-[4/5] relative border border-gray-200">
               {mainImage ? (
                <img src={mainImage} alt={product.name} className="w-full h-full object-cover object-center" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-black tracking-widest text-sm uppercase">DEPT STUDIO</div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: Detalles e Información */}
          <div className="flex flex-col md:py-4">
            {/* Título y Precio */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">{product.name}</h1>
              <p className="text-xl text-gray-800">${product.price?.toLocaleString('es-CL')}</p>
              <p className="text-sm text-gray-500 mt-2">Los gastos de envío se calculan en el checkout.</p>
            </div>

            {/* Selector de Tallas (Estilo Cuadrícula) */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold uppercase text-sm tracking-widest">Talla</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes && product.sizes.map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 border border-black flex items-center justify-center font-bold transition-colors uppercase
                      ${selectedSize === size ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col gap-3 mb-10">
              <button 
                onClick={handleAddToCart} 
                className="w-full bg-black text-white border border-black py-5 font-black uppercase tracking-widest hover:bg-gray-800 transition-colors"
              >
                Añadir al carrito
              </button>
              <Link 
                href="/checkout" 
                className="w-full text-center bg-white text-black border border-black py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
              >
                Ir al Checkout
              </Link>
            </div>

            {/* Descripción y Extras */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-bold uppercase text-sm mb-3">Descripción</h3>
              <div className="text-gray-600 text-sm space-y-4 leading-relaxed">
                {product.description ? <p className="whitespace-pre-line">{product.description}</p> : <p>Prenda diseñada bajo los más altos estándares de calidad urbana de DEPT STUDIO.</p>}
              </div>
            </div>
            
            <div className="flex flex-col gap-2 text-sm text-gray-500 pt-6 mt-6 border-t border-gray-200">
              <p>📦 Envíos a todo Chile vía Starken/Chilexpress.</p>
              <p>🔄 Cambios garantizados por talla.</p>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE PRODUCTOS RELACIONADOS */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-200 pt-16">
            <h2 className="text-xl font-black uppercase tracking-widest mb-8 text-left">Te podría interesar</h2>
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