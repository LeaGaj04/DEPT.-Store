"use client";
import Link from "next/link";
import { useState } from "react";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Intentando iniciar sesión con:", email);
    // Aquí luego conectaremos el AuthContext de Firebase
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-4">
      {/* Contenedor principal estilo DEPT */}
      <div className="bg-white w-full max-w-md p-10 md:p-14 shadow-2xl">
        <h1 className="text-3xl font-black tracking-tighter uppercase text-black text-center mb-8">
          INICIAR SESIÓN
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Campo Email */}
          <div>
            <label className="block text-[10px] font-black tracking-widest text-zinc-500 uppercase mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-100 border border-zinc-200 text-black px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="tu@email.com"
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-[10px] font-black tracking-widest text-zinc-500 uppercase mb-2">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-100 border border-zinc-200 text-black px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* Botón Entrar */}
          <button
            type="submit"
            className="w-full bg-black text-white font-black uppercase tracking-widest text-xs py-4 hover:bg-zinc-800 transition-colors mt-4"
          >
            Entrar
          </button>
        </form>

        {/* Enlaces inferiores */}
        <div className="mt-8 pt-6 border-t border-zinc-200 flex flex-col items-center space-y-4">
          <p className="text-xs text-zinc-500">
            ¿No tienes una cuenta?{" "}
            <Link 
              href="/registro" 
              className="text-black font-black uppercase tracking-wider hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}