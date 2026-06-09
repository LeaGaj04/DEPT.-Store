"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase'; 

export default function RegistroPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    

    const [primerNombre, setPrimerNombre] = useState('');
    const [segundoNombre, setSegundoNombre] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [direccion, setDireccion] = useState('');
    const [comuna, setComuna] = useState('');


    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegistroReal = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);


        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            setLoading(false);
            return;
        }

        try {

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "usuarios", user.uid), {
                uid: user.uid,
                email: email,
                primerNombre: primerNombre,
                segundoNombre: segundoNombre,
                apellidoPaterno: apellidoPaterno,
                apellidoMaterno: apellidoMaterno,

                envioPredeterminado: {
                    direccion: direccion,
                    comuna: comuna,
                },
                createdAt: new Date()
            });
            

            router.push('/perfil');
        } catch (err) {
            console.error("Error crítico en el flujo de registro:", err);

            if (err.code === 'auth/email-already-in-use') {
                setError('Este correo electrónico ya está registrado.');
            } else if (err.code === 'auth/invalid-email') {
                setError('El formato del correo electrónico no es válido.');
            } else if (err.code === 'auth/weak-password') {
                setError('La contraseña es muy débil.');
            } else {
                setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] bg-white flex items-center justify-center px-4 py-12">
            
            <div className="max-w-2xl w-full space-y-8 border border-zinc-200 p-8 sm:p-10 rounded-none shadow-sm bg-white">
                

                <div className="text-center">
                    <h2 className="text-2xl font-black tracking-widest text-black uppercase">
                        DEPT STUDIO
                    </h2>
                    <p className="mt-2 text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                        CREA TU CUENTA PARA GUARDAR TUS DATOS DE DESPACHO
                    </p>
                </div>


                <form className="mt-8 space-y-6" onSubmit={handleRegistroReal}>
                    

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-[11px] py-3 px-4 uppercase tracking-wider text-center font-bold">
                            {error}
                        </div>
                    )}


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                Primer Nombre
                            </label>
                            <input
                                type="text"
                                required
                                value={primerNombre}
                                onChange={(e) => setPrimerNombre(e.target.value)}
                                className="w-full px-4 py-3 bg-[#e8f0fe] border border-zinc-200/50 text-black text-sm rounded-none focus:outline-none focus:border-zinc-400 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                Segundo Nombre
                            </label>
                            <input
                                type="text"
                                value={segundoNombre}
                                onChange={(e) => setSegundoNombre(e.target.value)}
                                className="w-full px-4 py-3 bg-[#e8f0fe] border border-zinc-200/50 text-black text-sm rounded-none focus:outline-none focus:border-zinc-400 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                Apellido Paterno
                            </label>
                            <input
                                type="text"
                                required
                                value={apellidoPaterno}
                                onChange={(e) => setApellidoPaterno(e.target.value)}
                                className="w-full px-4 py-3 bg-[#e8f0fe] border border-zinc-200/50 text-black text-sm rounded-none focus:outline-none focus:border-zinc-400 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                Apellido Materno
                            </label>
                            <input
                                type="text"
                                required
                                value={apellidoMaterno}
                                onChange={(e) => setApellidoMaterno(e.target.value)}
                                className="w-full px-4 py-3 bg-[#e8f0fe] border border-zinc-200/50 text-black text-sm rounded-none focus:outline-none focus:border-zinc-400 transition-colors"
                            />
                        </div>


                        <div className="md:col-span-2 pt-2 border-t border-zinc-100 mt-2">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-black">Dirección de despacho predeterminada</p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                Calle, Número, Departamento o Casa
                            </label>
                            <input
                                type="text"
                                required
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                className="w-full px-4 py-3 bg-[#e8f0fe] border border-zinc-200/50 text-black text-sm rounded-none focus:outline-none focus:border-zinc-400 transition-colors"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                Comuna
                            </label>
                            <input
                                type="text"
                                required
                                value={comuna}
                                onChange={(e) => setComuna(e.target.value)}
                                className="w-full px-4 py-3 bg-[#e8f0fe] border border-zinc-200/50 text-black text-sm rounded-none focus:outline-none focus:border-zinc-400 transition-colors"
                            />
                        </div>


                        <div className="md:col-span-2 pt-2 border-t border-zinc-100 mt-2">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-black">Credenciales de acceso</p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-[#e8f0fe] border border-zinc-200/50 text-black text-sm rounded-none focus:outline-none focus:border-zinc-400 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-[#e8f0fe] border border-zinc-200/50 text-black text-sm rounded-none focus:outline-none focus:border-zinc-400 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-[#e8f0fe] border border-zinc-200/50 text-black text-sm rounded-none focus:outline-none focus:border-zinc-400 transition-colors"
                            />
                        </div>

                    </div>


                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-4 rounded-none hover:bg-zinc-900 transition-colors disabled:bg-zinc-400"
                        >
                            {loading ? 'CREANDO CUENTA PREMIUM...' : 'REGISTRARME'}
                        </button>
                    </div>


                    <div className="text-center pt-2 text-[11px] uppercase tracking-widest font-medium">
                        <span className="text-zinc-400">¿Ya tienes cuenta? </span>
                        <Link 
                            href="/login" 
                            className="text-black underline font-bold hover:text-zinc-700 transition-colors"
                        >
                            Inicia sesión
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    );
}

