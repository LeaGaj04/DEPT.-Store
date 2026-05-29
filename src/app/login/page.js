"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase"; // Ajusta esta ruta según tu estructura de carpetas
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔥 Autenticación real con Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      // 🚀 Redirección inmediata al perfil del usuario
      router.push("/perfil");
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas. Revisa tu email y contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      
      {/* CONTENEDOR PRINCIPAL BLANCO */}
      <div className="w-full max-w-md bg-white text-black p-8 border border-zinc-200 shadow-2xl">
        
        {/* LOGO / ENCABEZADO */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black uppercase tracking-widest text-black mb-1">DEPT STUDIO</h1>
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
            Ingresa a tu cuenta para ver tus pedidos
          </p>
        </div>

        {/* ALERTA DE ERROR ESTILIZADA */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-xs uppercase tracking-wider font-bold">
            ⚠️ {error}
          </div>
        )}

        {/* FORMULARIO */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest font-black text-zinc-500 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 p-4 text-sm text-black focus:outline-none focus:border-black focus:bg-white transition-all uppercase placeholder-zinc-300"
              placeholder="DEPT.CONTACT@GMAIL.COM"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-black text-zinc-500 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 p-4 text-sm text-black focus:outline-none focus:border-black focus:bg-white transition-all placeholder-zinc-300"
              placeholder="••••••••"
            />
          </div>

          {/* BOTÓN INVERTIDO: FONDO NEGRO / TEXTO BLANCO */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:bg-zinc-400 text-xs mt-2"
          >
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>

        {/* ENLACE DE REGISTRO */}
        <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
          <p className="text-xs text-zinc-400 uppercase tracking-wide font-medium">
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="text-black font-black underline hover:text-zinc-600 transition-colors ml-1">
              Regístrate aquí
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}