"use client";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
// 📦 Importamos los módulos necesarios de Firestore
import { doc, getDoc } from "firebase/firestore";
// Asegúrate de que apunte a tu archivo donde exportas tanto 'auth' como 'db'
import { auth, db } from "../../lib/firebase"; 
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // 📂 Estado para guardar los datos de Firestore
  const [loading, setLoading] = useState(true);

  // 📝 Mantenemos tus datos simulados de Pedidos por ahora (hasta que armemos la pasarela)
  const [orders, setOrders] = useState([
    {
      id: "15711",
      status: "En camino",
      date: "20 ene",
      itemCount: 1,
      total: 32300,
      images: ["/products/polera.jpg"]
    }
  ]);

  // 🔐 CONTROL DE SESIÓN Y CARGA DE DATOS DESDE FIRESTORE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Guardamos la sesión activa (Auth)

        try {
          // 🔥 Extrayendo la ficha del usuario desde Cloud Firestore usando su UID único
          const docRef = doc(db, "usuarios", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data()); // Guardamos nombres, apellidos y dirección real
          } else {
            console.log("No se encontró una ficha de datos para este UID.");
          }
        } catch (error) {
          console.error("Error al obtener los datos de Firestore:", error);
        }

      } else {
        router.push("/login"); // 🚫 Si no está logueado, al login
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white text-xs uppercase tracking-widest font-bold animate-pulse">
        Verificando cuenta...
      </p>
    </div>
  );
  
  if (!user) return null;

  return (
    <div className="min-h-screen bg-black w-full text-white pt-12 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO */}
        <div className="mb-12 border-b border-zinc-900 pb-6 flex justify-between items-end">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Mi Cuenta</p>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Perfil</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="text-xs uppercase tracking-widest font-bold border border-zinc-800 px-4 py-2 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: DATOS DE USUARIO REALES Y DIRECCIONES */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* TARJETA DATOS PERSONALES (CONECTADA A FIRESTORE) */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 relative">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">Datos Personales</h2>
              </div>
              <div className="space-y-1">
                {/* 🛠️ Concatenamos dinámicamente los dos nombres y apellidos de Firestore */}
                <p className="text-lg font-bold tracking-tight text-white uppercase">
                  {userData 
                    ? `${userData.primerNombre} ${userData.segundoNombre || ''} ${userData.apellidoPaterno} ${userData.apellidoMaterno}`
                    : "Cargando nombre..."
                  }
                </p>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2">Correo Electrónico</p>
                <p className="text-sm text-zinc-300">{user.email}</p>
              </div>
            </div>

            {/* SECCIÓN DIRECCIONES */}
            <div className="bg-zinc-950 border border-zinc-900 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">Mis Direcciones</h2>
                <button className="bg-white text-black text-xs font-black uppercase tracking-widest px-4 py-2 hover:bg-zinc-300 transition-colors">
                  + Agregar
                </button>
              </div>

              {/* 🛠️ Renderizado Dinámico de la Dirección Predeterminada de Registro */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData?.envioPredeterminado ? (
                  <div className="p-4 border border-white bg-zinc-950 relative flex flex-col justify-between h-52">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-white text-black">
                          Predeterminada
                        </span>
                      </div>
                      <div className="text-sm space-y-0.5 text-zinc-300">
                        <p className="font-bold text-white mb-1 uppercase">
                          {userData.primerNombre} {userData.apellidoPaterno}
                        </p>
                        <p>{userData.envioPredeterminado.direccion}</p>
                        <p>{userData.envioPredeterminado.comuna}</p>
                        <p>Santiago, Chile</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">No hay dirección de despacho guardada.</p>
                )}
              </div>
            </div>

          </div>

          {/* COLUMNA DERECHA: HISTORIAL DE PEDIDOS */}
          <div className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400 px-1">Historial de Pedidos</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-zinc-950 border border-zinc-900 overflow-hidden">
                  <div className="bg-zinc-900/50 px-4 py-3 border-b border-zinc-900 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">🚚</span>
                      <span className="font-bold uppercase tracking-widest text-zinc-200">{order.status}</span>
                      <span className="text-zinc-500">• {order.date}</span>
                    </div>
                    <span className="text-zinc-400 font-mono">#{order.id}</span>
                  </div>

                  <div className="p-4 flex gap-4 items-center">
                    <div className="flex gap-2 max-w-[60%] overflow-x-auto hide-scrollbar">
                      {order.images.map((img, idx) => (
                        <div key={idx} className="w-16 h-20 bg-black border border-zinc-800 flex-shrink-0 flex items-center justify-center p-1">
                          <img src={img} alt="item" className="max-w-full max-h-full object-contain" />
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{order.itemCount} artículo(s)</p>
                      <p className="text-lg font-black tracking-tight text-white">${order.total.toLocaleString('es-CL')} CLP</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}