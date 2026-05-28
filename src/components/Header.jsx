"use client";
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu } from 'lucide-react';
// 1. Importamos el hook del carrito
import { useCart } from '../context/CartContext';

export default function Header() {
    // 2. Extraemos la función para obtener el total de items
    const { getTotalItems } = useCart();

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Menú Hamburguesa (Móvil) */}
                    <div className="flex items-center md:hidden">
                        <button className="text-black hover:text-gray-600 transition-colors">
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
                        {/* Se mantiene tu conexión al panel de admin/login */}
                        <Link href="/login" className="text-black hover:text-gray-600 hidden sm:block transition-colors">
                            <User size={20} strokeWidth={1.5} />
                        </Link>

                        <Link href="/carrito" className="text-black hover:text-gray-600 relative transition-colors">
                            <ShoppingBag size={20} strokeWidth={1.5} />
                            {/* 3. Reemplazamos el "2" fijo por el contador dinámico */}
                            {getTotalItems() > 0 && (
                                <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                    {getTotalItems()}
                                </span>
                            )}
                        </Link>
                    </div>

                </div>
            </div>
        </header>
    );
}