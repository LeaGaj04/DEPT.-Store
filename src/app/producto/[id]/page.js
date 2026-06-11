"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import ProductCard from "../../../components/ProductCard";
import { useCart } from "../../../context/CartContext";
import { toast } from "react-hot-toast";

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

          // MAPEO INTELIGENTE SEGÚN TUS ARCHIVOS REALES
          let nombreImagen = "polera.jpg"; // Imagen por defecto por si acaso
          const nombreProducto = data.name ? data.name.toLowerCase() : "";

          if (nombreProducto.includes("beanie")) {
            nombreImagen = "beanie.jpg";
          } else if (nombreProducto.includes("trucker")) {
            nombreImagen = "trucker.jpg";
          } else if (nombreProducto.includes("polera")) {
            nombreImagen = "polera.jpg";
          }

          const urlImagenLocal = `/products/${nombreImagen}`;

          // Inyectamos la imagen correcta al producto
          const prodData = { id: docSnap.id, image: urlImagenLocal, ...data };
          setProduct(prodData);
          setMainImage(urlImagenLocal);

          // ACTUALIZACIÓN: Control para seleccionar automáticamente si viene una sola talla en el mapa
          if (data.sizes) {
            const disponibles = Object.keys(data.sizes);
            if (disponibles.length === 1) {
              setSelectedSize(disponibles[0]);
            }
          }

          // Productos relacionados
          const q = query(collection(db, "products"), limit(5));
          const querySnapshot = await getDocs(q);
          const related = [];
          querySnapshot.forEach((doc) => {
            if (doc.id !== id && related.length < 4) {
              const rData = doc.data();
              // También le aplicamos el mapeo a los relacionados para que no se rompan abajo
              let rImg = "polera.jpg";
              const rName = rData.name ? rData.name.toLowerCase() : "";
              if (rName.includes("beanie")) rImg = "beanie.jpg";
              else if (rName.includes("trucker")) rImg = "trucker.jpg";

              related.push({ id: doc.id, image: `/products/${rImg}`, ...rData });
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
      // Toast de error personalizado oscuro
      toast.error("Por favor, selecciona una talla antes de agregar al carrito.", {
        style: {
          background: '#000',
          color: '#fff',
          border: '1px solid #27272a',
          borderRadius: '0px',
        },
      });
      return;
    }

    // Agregamos al contexto del carrito
    addToCart(product, selectedSize);

    // 🔥 TU NUEVA NOTIFICACIÓN NEGRA CON ANIMACIONES NATIVAS DE TAILWIND 🔥
    toast.custom((t) => (
      <div
        className={`${t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          } transform transition-all duration-300 max-w-sm w-full bg-black border border-zinc-800 shadow-2xl flex pointer-events-auto z-[9999]`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            {/* Foto del Producto */}
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-14 w-14 rounded-sm object-cover border border-zinc-800"
                src={product.image}
                alt={product.name}
              />
            </div>
            {/* Textos */}
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-white uppercase tracking-tight">
                {product.name}
              </p>
              <p className="mt-1 text-xs text-zinc-400 uppercase">
                Talla: {selectedSize} <span className="mx-1">•</span> Cant: 1
              </p>
              <p className="mt-1 text-sm font-black text-white">
                ${product.price?.toLocaleString("es-CL")}
              </p>
            </div>
          </div>
        </div>
        {/* Botón para cerrar */}
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

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><p className="text-white text-xs uppercase tracking-widest font-bold animate-pulse">Cargando prenda...</p></div>;
  if (!product) return <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4"><p className="text-white text-xl font-bold uppercase tracking-widest">Producto no encontrado</p></div>;

  return (
    <div className="min-h-screen bg-black w-full text-white pt-10 pb-24">
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
                    className={`w-20 h-24 md:w-full md:h-32 flex-shrink-0 bg-zinc-900 border-2 transition-all ${mainImage === img ? 'border-white' : 'border-transparent'}`}
                  >
                    <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Imagen Principal Grande */}
            <div className="flex-1 bg-zinc-950 aspect-[4/5] relative border border-zinc-900 overflow-hidden">
              {mainImage ? (
                <img src={mainImage} alt={product.name} className="w-full h-full object-cover object-center" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 font-black tracking-widest text-sm uppercase">DEPT STUDIO</div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: Detalles e Información */}
          <div className="flex flex-col md:py-4">
            {/* Título y Precio */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2 text-white">{product.name}</h1>
              <p className="text-xl text-zinc-300">${product.price?.toLocaleString('es-CL')}</p>
              <p className="text-sm text-zinc-500 mt-2">Los gastos de envío se calculan en el checkout.</p>
            </div>

            {/* Selector de Tallas (Estilo Cuadrícula Adaptado al Stock Real) */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold uppercase text-sm tracking-widest text-zinc-300">Talla</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes && Object.keys(product.sizes).map((size) => {
                  const stockDisponible = product.sizes[size] || 0;
                  const estaAgotado = stockDisponible <= 0;

                  return (
                    <button
                      key={size}
                      disabled={estaAgotado}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 border flex flex-col items-center justify-center font-bold transition-all uppercase relative
                        ${estaAgotado
                          ? 'bg-zinc-950 text-zinc-600 border-zinc-900 line-through cursor-not-allowed opacity-30'
                          : selectedSize === size
                            ? 'bg-white text-black border-white'
                            : 'bg-black text-white border-zinc-700 hover:border-zinc-400'
                        }`}
                    >
                      <span className="text-sm">{size}</span>
                      {/* Badge discreto si solo queda 1 prenda disponible */}
                      {!estaAgotado && stockDisponible === 1 && (
                        <span className="absolute bottom-0.5 text-[7px] text-red-500 font-black tracking-tight animate-pulse">1 QDN</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col gap-3 mb-10">
              <button
                onClick={handleAddToCart}
                className="w-full bg-white text-black py-5 font-black uppercase tracking-widest hover:bg-zinc-300 transition-colors"
              >
                Añadir al carrito
              </button>
              <Link
                href="/checkout"
                className="w-full text-center bg-black text-white border border-zinc-700 py-4 text-sm font-bold uppercase tracking-widest hover:bg-zinc-900 transition-colors"
              >
                Ir al Checkout
              </Link>
            </div>

            {/* Descripción y Extras */}
            <div className="pt-6 border-t border-zinc-900">
              <h3 className="font-bold uppercase text-sm mb-3 text-white">Descripción</h3>
              <div className="text-zinc-400 text-sm space-y-4 leading-relaxed">
                {product.description ? <p className="whitespace-pre-line">{product.description}</p> : <p>Prenda diseñada bajo los más altos estándares de calidad urbana de DEPT STUDIO.</p>}
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm text-zinc-500 pt-6 mt-6 border-t border-zinc-900">
              <p>📦 Envíos a todo Chile vía Starken / Chilexpress.</p>
              <p>🔄 Cambios garantizados por talla.</p>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE PRODUCTOS RELACIONADOS */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-zinc-900 pt-16">
            <h2 className="text-xl font-black uppercase tracking-widest mb-8 text-left text-white">Te podría interesar</h2>
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