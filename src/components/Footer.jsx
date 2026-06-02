import Link from "next/link";
import { ArrowRight } from "lucide-react"; 

export default function Footer() {
  return (
    // ⚡ Cambiamos bg-white por bg-zinc-50 para ese contraste sutil
    <div className="bg-zinc-50 text-black w-full overflow-hidden border-t border-zinc-200">
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

          {/* Lado Derecho: Enlaces */}
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
          <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-black transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
          </Link>
          <Link href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-black transition-colors font-bold text-lg">
            TikTok
          </Link>
        </div>

      </div>
    </div>
  );
}