"use client";
import { useState, useEffect } from "react";
import { db, auth } from "../../../lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Trash2, Plus, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Estado para el formulario de nuevo producto (con Status y Stock agregados)
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "Poleras",
    description: "",
    imageUrl: "",
    status: "Disponible",
    stock: 10,
    sizes: "S, M, L, XL"
  });

  // 1. Proteger la ruta
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
      } else {
        setUser(currentUser);
        fetchProducts();
      }
    });
    return () => unsubscribe();
  }, [router]);

  // 2. Cargar productos desde Firebase
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(list);
    setLoading(false);
  };

  // 3. Crear producto en Firebase
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock), // Parseamos el stock a número
        sizes: newProduct.sizes.split(",").map(s => s.trim()),
        createdAt: serverTimestamp()
      });
      alert("Producto creado con éxito");
      // Reseteamos el formulario
      setNewProduct({ 
        name: "", price: "", category: "Poleras", description: "", 
        imageUrl: "", status: "Disponible", stock: 10, sizes: "S, M, L, XL" 
      });
      fetchProducts();
    } catch (err) {
      console.error("Error creando producto:", err);
    }
  };

  // 4. Eliminar producto
  const handleDelete = async (id) => {
    if (confirm("¿Seguro que quieres eliminar este producto?")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  const handleLogout = () => signOut(auth);

  if (!user || loading) return <div className="p-10 text-center uppercase tracking-widest text-xs text-white">Verificando Admin...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-white">
      {/* Header del Dashboard */}
      <div className="flex justify-between items-center mb-12 border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Panel de Inventario</h1>
        <button onClick={handleLogout} className="flex items-center text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors">
          <LogOut size={16} className="mr-2" /> Salir
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* COLUMNA IZQUIERDA: Formulario de Creación */}
        <div className="lg:col-span-1 bg-white p-8 rounded-sm shadow-lg">
          <h2 className="text-sm font-black uppercase tracking-widest mb-6 text-black">Nuevo Producto</h2>
          
          <form onSubmit={handleAddProduct} className="space-y-4">
            <input 
              placeholder="Nombre del producto" 
              className="w-full p-3 text-sm border border-gray-300 bg-white text-black placeholder-gray-500 outline-none focus:border-black transition-colors"
              value={newProduct.name}
              onChange={e => setNewProduct({...newProduct, name: e.target.value})}
              required 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <input 
                placeholder="Precio ($)" 
                type="number"
                className="w-full p-3 text-sm border border-gray-300 bg-white text-black placeholder-gray-500 outline-none focus:border-black transition-colors"
                value={newProduct.price}
                onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                required 
              />
              <select 
                className="w-full p-3 text-sm border border-gray-300 bg-white text-black outline-none focus:border-black transition-colors cursor-pointer"
                value={newProduct.category}
                onChange={e => setNewProduct({...newProduct, category: e.target.value})}
              >
                <option value="Poleras">Poleras</option>
                <option value="Hoodies">Hoodies</option>
                <option value="Pantalones">Pantalones</option>
                <option value="Accesorios">Accesorios</option>
              </select>
            </div>

            {/* Nuevos campos de Stock y Status */}
            <div className="grid grid-cols-2 gap-4">
              <input 
                placeholder="Stock (Unidades)" 
                type="number"
                className="w-full p-3 text-sm border border-gray-300 bg-white text-black placeholder-gray-500 outline-none focus:border-black transition-colors"
                value={newProduct.stock}
                onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                required 
              />
              <select 
                className="w-full p-3 text-sm border border-gray-300 bg-white text-black outline-none focus:border-black transition-colors cursor-pointer"
                value={newProduct.status}
                onChange={e => setNewProduct({...newProduct, status: e.target.value})}
              >
                <option value="Disponible">Disponible</option>
                <option value="Agotado">Agotado</option>
              </select>
            </div>

            <textarea 
              placeholder="Descripción del producto..." 
              className="w-full p-3 text-sm border border-gray-300 bg-white text-black placeholder-gray-500 outline-none focus:border-black transition-colors h-24 resize-none"
              value={newProduct.description}
              onChange={e => setNewProduct({...newProduct, description: e.target.value})}
            />
            
            <input 
              placeholder="URL de la imagen (ej: https://...)" 
              className="w-full p-3 text-sm border border-gray-300 bg-white text-black placeholder-gray-500 outline-none focus:border-black transition-colors"
              value={newProduct.imageUrl}
              onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})}
              required 
            />
            
            <input 
              placeholder="Tallas (Ej: S, M, L, XL)" 
              className="w-full p-3 text-sm border border-gray-300 bg-white text-black placeholder-gray-500 outline-none focus:border-black transition-colors"
              value={newProduct.sizes}
              onChange={e => setNewProduct({...newProduct, sizes: e.target.value})}
            />
            
            <button className="w-full bg-black text-white py-4 mt-2 text-xs font-bold uppercase tracking-widest flex items-center justify-center hover:bg-gray-800 transition-colors">
              <Plus size={16} className="mr-2" /> Crear Producto
            </button>
          </form>
        </div>

        {/* COLUMNA DERECHA: Lista de Productos Actuales */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-black uppercase tracking-widest mb-6">Productos en Tienda ({products.length})</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-[10px] uppercase tracking-widest text-gray-500">
                  <th className="pb-4 font-bold">Producto</th>
                  <th className="pb-4 font-bold">Categoría</th>
                  <th className="pb-4 font-bold">Stock</th>
                  <th className="pb-4 font-bold">Precio</th>
                  <th className="pb-4 font-bold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {products.map((p) => (
                  <tr key={p.id} className="text-sm hover:bg-gray-900/50 transition-colors">
                    <td className="py-4 flex items-center">
                      <img src={p.imageUrl} className="w-10 h-10 object-cover mr-4 bg-gray-800" alt={p.name} />
                      <div className="flex flex-col">
                        <span className="font-bold uppercase text-xs text-white">{p.name}</span>
                        <span className={`text-[10px] uppercase font-bold mt-1 ${p.status === 'Agotado' ? 'text-red-500' : 'text-green-500'}`}>
                          {p.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-400 text-xs uppercase">{p.category}</td>
                    <td className="py-4 text-gray-400 text-xs">{p.stock} un.</td>
                    <td className="py-4 text-xs font-bold text-white">${p.price.toLocaleString('es-CL')}</td>
                    <td className="py-4 text-right">
                      <button onClick={() => handleDelete(p.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500 text-xs uppercase tracking-widest">
                      No hay productos en la tienda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}