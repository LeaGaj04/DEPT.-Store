"use client";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function InventoryChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatosData = async () => {
      try {
        // 1. Traer los productos reales de tu Firestore
        const productsSnapshot = await getDocs(collection(db, "products"));
        
        const nombres = [];
        const stockTotal = [];
        const ventasSimuladas = []; // Aquí luego conectarás con el conteo de tu colección 'orders'

        productsSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          nombres.push(data.name || "Producto");
          
          // Calcular la suma de todo el stock de las tallas que tenga el producto
          let stockProducto = 0;
          if (data.sizes && typeof data.sizes === "object") {
            // Si viene como {S: 5, M: 10, L: 2}
            stockProducto = Object.values(data.sizes).reduce((a, b) => a + b, 0);
          } else {
            stockProducto = data.stock || 0;
          }
          stockTotal.push(stockProducto);

          // Ventas: Por ahora ponemos un número al azar o fijo para pintar la línea múltiple como en la imagen
          ventasSimuladas.push(Math.floor(Math.random() * 20) + 2); 
        });

        // 2. Configurar el diseño idéntico al ejemplo pero con la identidad DEPT
        setChartData({
          labels: nombres.slice(0, 7), // Limitamos a los primeros 7 productos para que no se sature la vista
          datasets: [
            {
              label: "Stock Disponible",
              data: stockTotal.slice(0, 7),
              borderColor: "#71717a", // Línea Gris
              backgroundColor: "#71717a",
              tension: 0.3, // Curvatura suave de la línea como en tu imagen
              pointBackgroundColor: "#000000",
              pointBorderColor: "#71717a",
              pointRadius: 5,
            },
            {
              label: "Unidades Vendidas",
              data: ventasSimuladas.slice(0, 7),
              borderColor: "#dc2626", // Línea Roja DEPT 
              backgroundColor: "#dc2626",
              tension: 0.3,
              pointBackgroundColor: "#ffffff",
              pointBorderColor: "#dc2626",
              pointRadius: 5,
            },
          ],
        });
      } catch (error) {
        console.error("Error cargando datos para el gráfico:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatosData();
  }, []);

  // Opciones de personalización del gráfico (fuentes, rejillas, etc.)
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff", // Leyendas en blanco para fondo oscuro
          font: { fontFamily: "monospace", size: 11 }
        },
      },
    },
    scales: {
      x: {
        grid: { color: "#18181b" }, // Líneas divisorias verticales en gris oscuro
        ticks: { color: "#a1a1aa", font: { fontFamily: "monospace" } },
      },
      y: {
        grid: { color: "#18181b" }, // Líneas divisorias horizontales en gris oscuro
        ticks: { color: "#a1a1aa", font: { fontFamily: "monospace" } },
      },
    },
  };

  if (loading) {
    return <div style={{ color: "#71717a", fontFamily: "monospace", fontSize: "12px" }}>Cargando analíticas de inventario...</div>;
  }

  return (
    <div style={{ width: "100%", height: "350px", backgroundColor: "#000000", padding: "20px", border: "1px solid #18181b" }}>
      <h3 style={{ color: "#ffffff", fontFamily: "monospace", fontSize: "14px", textTransform: "uppercase", marginBottom: "20px", letterSpacing: "0.05em" }}>
        📉 Balance: Stock vs Unidades Vendidas
      </h3>
      {chartData && <Line data={chartData} options={options} />}
    </div>
  );
}