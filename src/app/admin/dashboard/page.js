"use client";
import { useState, useEffect } from "react";
import { db, auth } from "../../../lib/firebase"; // Quitamos 'storage'
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Trash2, Plus, LogOut, Package, Tag, CheckCircle } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Estado del formulario (Volvemos a imageUrl en texto)
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

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push("/admin/login");
      else {
        setUser(currentUser);
        fetchProducts();
        fetchOrders();
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(list);
    setLoading(false);
  };

  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedList = list.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      setOrders(sortedList);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // 🔥 MAGIA ACTUALIZADA: Usando tus imágenes locales de la carpeta public/products/
      let finalImageUrl = newProduct.imageUrl.trim();

      if (!finalImageUrl) {
        if (newProduct.category === "Beanies") {
          finalImageUrl = "/products/beanie-black.jpg";
        } else if (newProduct.category === "Trucker Hats") {
          finalImageUrl = "/products/trucker-classic.jpg";
        } else {
          // Por si creas una polera y lo dejas en blanco
          finalImageUrl = "/products/polera-default.jpg";
        }
      }

      await addDoc(collection(db, "products"), {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        sizes: newProduct.sizes.split(",").map(s => s.trim()),
        imageUrl: finalImageUrl,
        createdAt: serverTimestamp()
      });

      alert("Producto creado con éxito");

      setNewProduct({
        name: "", price: "", category: "Poleras", description: "",
        imageUrl: "", status: "Disponible", stock: 10, sizes: "S, M, L, XL"
      });
      fetchProducts();
    } catch (err) {
      console.error("Error creando producto:", err);
      alert("Hubo un error al crear el producto.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Seguro que quieres eliminar este producto?")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (confirm(`¿Marcar pedido como ${newStatus}?`)) {
      try {
        await updateDoc(doc(db, "orders", orderId), { status: newStatus });
        fetchOrders();
      } catch (error) {
        console.error("Error actualizando estado del pedido:", error);
      }
    }
  };

  const handleLogout = () => signOut(auth);

  if (!user || loading) return <div className="p-10 text-center uppercase tracking-widest text-xs text-white">Verificando Admin...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-white">
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Panel de Administración</h1>
        <button onClick={handleLogout} className="flex items-center text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors">
          <LogOut size={16} className="mr-2" /> Salir
        </button>
      </div>

      <div className="flex space-x-2 mb-10">
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center px-6 py-3 text-xs font-black uppercase tracking-widest border border-zinc-800 transition-all ${activeTab === "products" ? "bg-white text-black border-white" : "bg-zinc-950 text-gray-400 hover:bg-zinc-900"}`}
        >
          <Tag size={14} className="mr-2" /> Inventario de Productos
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center px-6 py-3 text-xs font-black uppercase tracking-widest border border-zinc-800 transition-all ${activeTab === "orders" ? "bg-white text-black border-white" : "bg-zinc-950 text-gray-400 hover:bg-zinc-900"}`}
        >
          <Package size={14} className="mr-2" /> Pedidos Recibidos
          {orders.filter(o => o.status === "Pagado").length > 0 && (
            <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-[9px] font-black">
              {orders.filter(o => o.status === "Pagado").length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "products" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 bg-white p-8 rounded-sm shadow-lg">
            <h2 className="text-sm font-black uppercase tracking-widest mb-6 text-black">Nuevo Producto</h2>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <input
                placeholder="Nombre del producto"
                className="w-full p-3 text-sm border border-gray-300 bg-white text-black placeholder-gray-500 outline-none focus:border-black transition-colors"
                value={newProduct.name}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Precio ($)"
                  type="number"
                  className="w-full p-3 text-sm border border-gray-300 bg-white text-black placeholder-gray-500 outline-none focus:border-black transition-colors"
                  value={newProduct.price}
                  onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                  required
                />
                <select
                  className="w-full p-3 text-sm border border-gray-300 bg-white text-black outline-none focus:border-black transition-colors cursor-pointer"
                  value={newProduct.category}
                  onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  <option value="Poleras">Poleras</option>
                  <option value="Beanies">Beanies</option>
                  <option value="Trucker Hats">Trucker Hats</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Stock (Unidades)"
                  type="number"
                  className="w-full p-3 text-sm border border-gray-300 bg-white text-black placeholder-gray-500 outline-none focus:border-black transition-colors"
                  value={newProduct.stock}
                  onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                  required
                />
                <select
                  className="w-full p-3 text-sm border border-gray-300 bg-white text-black outline-none focus:border-black transition-colors cursor-pointer"
                  value={newProduct.status}
                  onChange={e => setNewProduct({ ...newProduct, status: e.target.value })}
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Agotado">Agotado</option>
                </select>
              </div>

              <textarea
                placeholder="Descripción del producto..."
                className="w-full p-3 text-sm border border-gray-300 bg-white text-black placeholder-gray-500 outline-none focus:border-black transition-colors h-24 resize-none"
                value={newProduct.description}
                onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
              />

              <input
                placeholder="Tallas (Ej: S, M, L, XL o Talla Única)"
                className="w-full p-3 text-sm border border-gray-300 bg-white text-black placeholder-gray-500 outline-none focus:border-black transition-colors"
                value={newProduct.sizes}
                onChange={e => setNewProduct({ ...newProduct, sizes: e.target.value })}
              />

              <input
                placeholder="URL Imagen (Opcional - deja vacío para predeterminada)"
                className="w-full p-3 text-sm border border-gray-300 bg-white text-black placeholder-gray-500 outline-none focus:border-black transition-colors"
                value={newProduct.imageUrl}
                onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
              />
              <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-widest">
                *Si lo dejas en blanco, usaremos una foto genérica.
              </p>

              <button
                disabled={isUploading}
                className="w-full bg-black text-white py-4 mt-2 text-xs font-bold uppercase tracking-widest flex items-center justify-center hover:bg-gray-800 transition-colors disabled:bg-gray-500"
              >
                <Plus size={16} className="mr-2" />
                {isUploading ? "Creando..." : "Crear Producto"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-widest mb-6">Productos en Tienda ({products.length})</h2>

            <div className="overflow-x-auto border border-zinc-900 bg-zinc-950">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 text-[10px] uppercase tracking-widest text-gray-500 bg-black">
                    <th className="p-4 font-bold">Producto</th>
                    <th className="p-4 font-bold">Categoría</th>
                    <th className="p-4 font-bold">Stock</th>
                    <th className="p-4 font-bold">Precio</th>
                    <th className="p-4 font-bold text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {products.map((p) => (
                    <tr key={p.id} className="text-sm hover:bg-zinc-900/40 transition-colors">
                      <td className="p-4 flex items-center">
                        <img src={p.imageUrl} className="w-10 h-10 object-cover mr-4 bg-zinc-900" alt={p.name} />
                        <div className="flex flex-col">
                          <span className="font-bold uppercase text-xs text-white">{p.name}</span>
                          <span className={`text-[10px] uppercase font-bold mt-1 ${p.status === 'Agotado' ? 'text-red-500' : 'text-green-500'}`}>
                            {p.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400 text-xs uppercase">{p.category}</td>
                      <td className="p-4 text-gray-400 text-xs">{p.stock} un.</td>
                      <td className="p-4 text-xs font-bold text-white">${p.price.toLocaleString('es-CL')}</td>
                      <td className="p-4 text-right">
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
      )}

      {activeTab === "orders" && (
        <div className="bg-zinc-950 border border-zinc-900 rounded-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-[10px] uppercase tracking-widest text-gray-500 bg-black">
                  <th className="p-4 font-bold">Orden / Fecha</th>
                  <th className="p-4 font-bold">Cliente / Envío</th>
                  <th className="p-4 font-bold">Detalle Productos</th>
                  <th className="p-4 font-bold">Total Pagado</th>
                  <th className="p-4 font-bold">Estado</th>
                  <th className="p-4 font-bold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {orders.map((order) => (
                  <tr key={order.id} className="text-sm hover:bg-zinc-900/30 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-xs uppercase block text-white">#{order.orderId || order.id.slice(0, 8)}</span>
                      <span className="text-[10px] text-gray-500 block mt-1">
                        {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('es-CL') : "Reciente"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-xs block text-white">{order.buyer?.name || "N/A"}</span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">{order.buyer?.email}</span>
                      <span className="text-[10px] text-gray-500 block mt-1 italic max-w-[200px] truncate">{order.buyer?.address || "Retiro / Sin Dirección"}</span>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="text-xs text-gray-300">
                            <span className="font-bold text-white">{item.quantity}x</span> {item.name}
                            {item.size && <span className="text-gray-500 text-[10px] ml-1">({item.size})</span>}
                          </div>
                        )) || <span className="text-gray-500 text-xs">Sin detalle</span>}
                      </div>
                    </td>
                    <td className="p-4 text-xs font-bold text-white">
                      ${(order.total || 0).toLocaleString('es-CL')}
                    </td>
                    <td className="p-4">
                      <span className={`text-[9px] px-2.5 py-1 font-black uppercase tracking-wider rounded-sm ${order.status === 'Pagado' ? 'bg-green-950 text-green-400 border border-green-900/50' : order.status === 'Enviado' ? 'bg-blue-950 text-blue-400 border border-blue-900/50' : 'bg-zinc-900 text-zinc-400'}`}>
                        {order.status || 'Pendiente'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {order.status === 'Pagado' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'Enviado')}
                          className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-black bg-white px-3 py-2 hover:bg-gray-200 transition-colors"
                        >
                          <CheckCircle size={12} className="mr-1.5" /> Despachado
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500 text-xs uppercase tracking-widest">
                      Aún no hay pedidos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}