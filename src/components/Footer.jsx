import Link from "next/link";
import { ArrowRight } from "lucide-react"; 

export default function Footer() {
  // Array con las 8 URLs de Pinterest (puedes cambiarlas por las tuyas luego)
  const images = [
    "https://i.pinimg.com/1200x/53/a7/64/53a764d81d448ccfc3f0c4cf4b826341.jpg", // 1
    "https://i.pinimg.com/1200x/fa/ba/9f/faba9f487ee5c0d90450658a75d9671a.jpg", // 2
    "https://i.pinimg.com/736x/83/6c/47/836c475e53aff4fbfba7be929651624b.jpg", // 3
    "https://i.pinimg.com/736x/22/79/0f/22790f8ad40d0c77bd80e023bf5de14d.jpg", // 4
    "https://i.pinimg.com/1200x/cd/fc/60/cdfc6090d76279124478afe011a2f9f4.jpg", // 5
    "https://i.pinimg.com/736x/62/c7/b3/62c7b3987f950bb7e614522577f400af.jpg", // 6
    "https://i.pinimg.com/736x/d1/3b/5e/d13b5e177573869ac09e1efbc0eef11e.jpg", // 7
    "https://i.pinimg.com/1200x/5a/d8/04/5ad804019bff3382356371293ea1a713.jpg" // 8
  ];

  return (
    <div className="bg-white text-black w-full overflow-hidden">
      
      {/* SECCIÓN 1: GALERÍA DE INSTAGRAM EN CARRUSEL INFINITO (@DEPT_STUDIO) */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 uppercase">
            @Dept.
          </h2>
        </div>
        
        {/* Contenedor del Carrusel - overflow-hidden para ocultar lo que sale de la pantalla */}
        <div className="relative flex overflow-x-hidden group">
          
          {/* Pista de animación - Duplicamos el contenido para el efecto infinito */}
          <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
            
            {/* Primera tanda de 8 imágenes */}
            {images.map((src, index) => (
              <div key={`first-${index}`} className="flex-none w-48 md:w-64 aspect-[3/4] mx-2 bg-zinc-100 overflow-hidden cursor-pointer">
                <img 
                  src={src} 
                  alt={`Feed ${index + 1}`} 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                />
              </div>
            ))}
            
            {/* Segunda tanda de 8 imágenes (idéntica, para que el loop sea invisible) */}
            {images.map((src, index) => (
              <div key={`second-${index}`} className="flex-none w-48 md:w-64 aspect-[3/4] mx-2 bg-zinc-100 overflow-hidden cursor-pointer">
                <img 
                  src={src} 
                  alt={`Feed ${index + 1} clone`} 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                />
              </div>
            ))}
            
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: NEWSLETTER Y ENLACES (Se mantiene igual) */}
      <div className="border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8">
            
            {/* Lado Izquierdo: Newsletter */}
            <div className="max-w-sm">
              <h3 className="font-black text-lg mb-2 capitalize">únete a nuestro newsletter</h3>
              <p className="text-zinc-600 text-sm mb-6">
                Obtén ofertas exclusivas y acceso anticipado a nuevos productos.
              </p>
              <form className="flex items-end border-b border-black pb-2">
                <input 
                  type="email" 
                  placeholder="dirección de correo electrónico" 
                  className="w-full bg-transparent outline-none text-sm placeholder-zinc-500"
                />
                <button type="submit" className="ml-2 hover:translate-x-1 transition-transform">
                  <ArrowRight size={20} strokeWidth={1.5} />
                </button>
              </form>
            </div>

            {/* Lado Derecho: Enlaces conectados a /ayuda */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* Columna 1 */}
              <div className="flex flex-col space-y-3">
                <h4 className="font-black capitalize mb-2">ayuda</h4>
                <Link href="/ayuda" className="text-zinc-600 text-sm hover:text-black">contacto</Link>
                <Link href="/ayuda" className="text-zinc-600 text-sm hover:text-black">envíos</Link>
                <Link href="/ayuda" className="text-zinc-600 text-sm hover:text-black">seguimiento de pedido</Link>
                <Link href="/ayuda" className="text-zinc-600 text-sm hover:text-black">preguntas frecuentes</Link>
              </div>
              
              {/* Columna 2 */}
              <div className="flex flex-col space-y-3">
                <h4 className="font-black capitalize mb-2">dept studio</h4>
                <Link href="/ayuda" className="text-zinc-600 text-sm hover:text-black">sobre nosotros</Link>
                <Link href="/ayuda" className="text-zinc-600 text-sm hover:text-black">campañas</Link>
                <Link href="/ayuda" className="text-zinc-600 text-sm hover:text-black">novedades</Link>
              </div>

              {/* Columna 3 */}
              <div className="flex flex-col space-y-3">
                <h4 className="font-black capitalize mb-2">tienda</h4>
                <Link href="/ayuda" className="text-zinc-600 text-sm hover:text-black">dónde encontrarnos</Link>
                <Link href="/ayuda" className="text-zinc-600 text-sm hover:text-black">guía de tallas</Link>
                <Link href="/ayuda" className="text-zinc-600 text-sm hover:text-black">métodos de pago</Link>
              </div>
            </div>

          </div>

          {/* Iconos Sociales Bottom Right */}
          <div className="flex justify-end mt-12 space-x-4 items-center">
            {/* Reemplaza la URL de Instagram de DEPT. aquí si tienes una */}
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-black transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </Link>
            {/* Reemplaza la URL de TikTok de DEPT. aquí si tienes una */}
            <Link href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-black transition-colors font-bold text-lg">
              TikTok
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}