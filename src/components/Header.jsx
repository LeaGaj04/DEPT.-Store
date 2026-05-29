"use client";
import { useState } from 'react'; // <-- 1. Añadimos useState
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react'; // <-- 2. Añadimos el icono X para cerrar el menú
import { useCart } from '../context/CartContext';

export default function Header() {
    // ESTADO PARA EL MENÚ MÓVIL
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Extraemos la función para obtener el total de items
    const { getTotalItems } = useCart();

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Menú Hamburguesa (Móvil) */}
                    <div className="flex items-center md:hidden">
                        {/* 3. Agregamos el onClick para abrir el menú */}
                        <button 
                            onClick={() => setIsMenuOpen(true)} 
                            className="text-black hover:text-gray-600 transition-colors focus:outline-none"
                        >
                            <Menu size={24} />
                        </button>
                    </div>

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center justify-center md:justify-start flex-1 md:flex-none">
                        <Link href="/" className="text-2xl font-black tracking-tighter text-black uppercase">
                            DEPT.
                        </Link>
                    </div>

                    {/* Navegación Desktop */}
                    <nav className="hidden md:flex space-x-8">
                        <Link href="/" className="text-sm font-medium text-black hover:text-gray-500 uppercase tracking-wide transition-colors">Inicio</Link>
                        <Link href="/catalogo" className="text-sm font-medium text-black hover:text-gray-500 uppercase tracking-wide transition-colors">Drop</Link>
                        <Link href="/catalogo?categoria=beanie" className="text-sm font-medium text-black hover:text-gray-500 uppercase tracking-wide transition-colors">Beanies</Link>
                        <Link href="/catalogo?categoria=trucker" className="text-sm font-medium text-black hover:text-gray-500 uppercase tracking-wide transition-colors">Trucker Hats</Link>
                        <Link href="/catalogo?categoria=polera" className="text-sm font-medium text-black hover:text-gray-500 uppercase tracking-wide transition-colors">Poleras</Link>
                    </nav>

                    {/* Iconos (Buscar, Cuenta, Carrito) */}
                    <div className="flex items-center space-x-4 md:space-x-6">
                        <button className="text-black hover:text-gray-600 hidden sm:block transition-colors">
                            <Search size={20} strokeWidth={1.5} />
                        </button>
                        
                        <Link href="/login" className="text-black hover:text-gray-600 hidden sm:block transition-colors">
                            <User size={20} strokeWidth={1.5} />
                        </Link>

                        <Link href="/carrito" className="text-black hover:text-gray-600 relative transition-colors">
                            <ShoppingBag size={20} strokeWidth={1.5} />
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                    {getTotalItems()}
                                </span>
                            )}
                        </Link>
                    </div>

                </div>
            </div>

            {/* ========================================= */}
            {/* PANEL LATERAL MÓVIL (DRAWER OSCURO) */}
            {/* ========================================= */}
            <div 
                className={`fixed inset-0 bg-[#0a0a0a] text-white z-[100] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col
                ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Cabecera del Menú Móvil */}
                <div className="flex justify-between items-center h-20 px-4 sm:px-6 border-b border-zinc-800">
                    <Link href="/" className="font-black text-2xl tracking-tighter text-white uppercase">
                        DEPT.
                    </Link>
                    <button 
                        onClick={() => setIsMenuOpen(false)}
                        className="text-white hover:text-zinc-400 transition-colors focus:outline-none"
                    >
                        {/* Usamos el icono X de lucide-react */}
                        <X size={24} />
                    </button>
                </div>

                {/* Enlaces del Menú Móvil */}
                <nav className="flex flex-col px-6 pt-10 space-y-8">
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium tracking-wide text-zinc-200 hover:text-white uppercase">
                        Inicio
                    </Link>
                    <Link href="/catalogo" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium tracking-wide text-zinc-200 hover:text-white uppercase">
                        Drop
                    </Link>
                    <Link href="/catalogo?categoria=beanie" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium tracking-wide text-zinc-200 hover:text-white uppercase">
                        Beanies
                    </Link>
                    <Link href="/catalogo?categoria=trucker" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium tracking-wide text-zinc-200 hover:text-white uppercase">
                        Trucker Hats
                    </Link>
                    <Link href="/catalogo?categoria=polera" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium tracking-wide text-zinc-200 hover:text-white uppercase">
                        Poleras
                    </Link>
                </nav>

                {/* Pie del Menú Móvil (Perfil / Login) */}
                <div className="mt-auto px-6 pb-12 space-y-6 border-t border-zinc-800 pt-8">
                    <Link 
                        href="/login" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 text-base font-medium text-zinc-300 hover:text-white uppercase tracking-wide"
                    >
                        <User size={22} strokeWidth={1.5} />
                        Mi Perfil / Iniciar sesión
                    </Link>
                </div>
            </div>

        </header>
    );
}