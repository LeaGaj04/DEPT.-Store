export default function TopBar() {
  return (
    <div className="w-full bg-black py-2.5 overflow-hidden relative z-50 select-none flex items-center">
      
      {/* Estilos inyectados para el movimiento fluido 360 */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-infinite {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
      `}</style>

      <div className="animate-marquee-infinite">
        {/* BLOQUE 1: Mitad del ciclo */}
        {/* space-x-64 da una separación enorme y whitespace-nowrap evita que el texto se rompa */}
        <div className="flex items-center space-x-64 pr-64 text-xs font-semibold uppercase tracking-widest text-white">
          <span className="whitespace-nowrap">Envío gratis por compras desde $60.000</span>
          <span className="whitespace-nowrap">Envío gratis por compras desde $60.000</span>
          <span className="whitespace-nowrap">Envío gratis por compras desde $60.000</span>
          <span className="whitespace-nowrap">Envío gratis por compras desde $60.000</span>
        </div>
        
        {/* BLOQUE 2: La otra mitad exacta para cerrar la vuelta de 360 grados */}
        <div className="flex items-center space-x-64 pr-64 text-xs font-semibold uppercase tracking-widest text-white" aria-hidden="true">
          <span className="whitespace-nowrap">Envío gratis por compras desde $60.000</span>
          <span className="whitespace-nowrap">Envío gratis por compras desde $60.000</span>
          <span className="whitespace-nowrap">Envío gratis por compras desde $60.000</span>
          <span className="whitespace-nowrap">Envío gratis por compras desde $60.000</span>
        </div>
      </div>
      
    </div>
  );
}