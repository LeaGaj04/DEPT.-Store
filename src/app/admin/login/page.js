"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // 🔥 LA MAGIA PARA EL MIDDLEWARE 🔥
      // Guardamos una cookie accesible en todo el sitio que expira en 8 horas (28800 segundos)
      document.cookie = "admin_session=true; path=/; max-age=28800";

      router.push("/admin/dashboard");
    } catch (err) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="max-w-md w-full border border-gray-200 p-8 bg-white shadow-sm">
        <h1 className="text-2xl font-black uppercase tracking-tighter text-black mb-6 text-center">
          Admin DEPT.
        </h1>
        
        {error && <p className="text-red-500 text-xs mb-4 uppercase font-bold text-center">{error}</p>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-gray-500">Email</label>
            <input 
              type="email" 
              className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-gray-500">Contraseña</label>
            <input 
              type="password" 
              className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            Entrar al Panel
          </button>
        </form>
      </div>
    </div>
  );
}