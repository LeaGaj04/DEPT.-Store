"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Ticket } from "lucide-react";

export default function WelcomeDiscount() {
  const [showPopup, setShowPopup] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    // Revisamos si el usuario ya interactuó con el anuncio antes para no ser molestos
    const hasSeenPopup = localStorage.getItem("dept_popup_seen");
    const isUserLoggedIn = localStorage.getItem("dept_user_logged"); // Simulación de sesión

    if (!hasSeenPopup && !isUserLoggedIn) {
      // Esperamos 2.5 segundos después de que cargue la página para lanzar el anuncio (da mejor experiencia)
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 2500);
      return () => clearTimeout(timer);
    } else if (hasSeenPopup && !isUserLoggedIn) {
      // Si ya cerró el popup pero no ha iniciado sesión, mostramos la viñeta flotante al tiro
      setShowBadge(true);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowBadge(true); // Se minimiza a la esquina
    localStorage.setItem("dept_popup_seen", "true");
  };

  const handleOpenFromBadge = () => {
    setShowBadge(false);
    setShowPopup(true);
  };

  return (
    <>
{/* 1. EL ANUNCIO PRINCIPAL (POPUP MODAL) */}
      {showPopup && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.85)", // Fondo oscuro con opacidad
          backdropFilter: "blur(4px)",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px"
        }}>
          <div style={{
            backgroundColor: "#000000", // Negro absoluto de fondo
            border: "1px solid #27272a", // Borde gris oscuro sutil
            maxWidth: "450px",
            width: "100%",
            padding: "40px 30px",
            position: "relative",
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
          }}>
            {/* Botón Cerrar */}
            <button 
              onClick={handleClosePopup}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "none",
                border: "none",
                color: "#71717a", // Gris
                cursor: "pointer",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = '#71717a'}
            >
              <X size={20} />
            </button>

            {/* Contenido del Anuncio */}
            {/* Cambiado a un círculo con fondo gris muy oscuro e ícono blanco */}
            <div style={{ 
              display: "inline-flex", 
              padding: "12px", 
              backgroundColor: "#141416", 
              border: "1px solid #27272a",
              borderRadius: "50%", 
              marginBottom: "20px" 
            }}>
              <Ticket size={24} color="#ffffff" /> 
            </div>

            <h2 style={{ 
              fontSize: "24px", 
              fontWeight: "900", 
              textTransform: "uppercase", 
              letterSpacing: "-0.05em", 
              color: "#ffffff", 
              marginBottom: "12px" 
            }}>
              ÚNETE A LA COLECTIVIDAD
            </h2>
            
            <p style={{ 
              fontSize: "13px", 
              color: "#a1a1aa", // Gris suave para los textos secundarios
              lineHeight: "1.6", 
              marginBottom: "25px" 
            }}>
              Inicia sesión o crea tu cuenta ahora mismo y te daremos un <strong style={{ color: "#ffffff", fontWeight: "900" }}>10% DE DESCUENTO</strong> inmediato en tu primera compra del drop.
            </p>

            {/* Botón de Acción Principal (Blanco sólido, texto negro) */}
            <Link 
              href="/login"
              onClick={() => {
                setShowPopup(false);
                localStorage.setItem("dept_popup_seen", "true");
              }}
              style={{
                display: "block",
                backgroundColor: "#ffffff",
                color: "#000000",
                textDecoration: "none",
                padding: "14px 0",
                fontSize: "11px",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                transition: "opacity 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Iniciar Sesión / Registrarse
            </Link>

            {/* Link secundario en gris */}
            <button 
              onClick={handleClosePopup}
              style={{
                background: "none",
                border: "none",
                color: "#71717a", // Gris apagado
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginTop: "20px",
                cursor: "pointer",
                textDecoration: "underline"
              }}
              onMouseEnter={(e) => e.target.style.color = '#a1a1aa'}
              onMouseLeave={(e) => e.target.style.color = '#71717a'}
            >
              No gracias, prefiero pagar el total
            </button>
          </div>
        </div>
      )}

{/* 2. LA VIÑETA FLOTANTE (BADGE DE ESQUINA) */}
      {showBadge && (
        <div 
          onClick={handleOpenFromBadge}
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            backgroundColor: "#ffffff", // Fondo Blanco Limpio
            color: "#000000",           // Texto Negro Base
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            zIndex: 9998,
            border: "1px solid #e4e4e7", // Un borde sutil para que resalte si el fondo general es claro
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)", // Sombra oscura pero suave
            animation: "pulseBadge 2s infinite ease-in-out",
            userSelect: "none"
          }}
        >
          {/* Keyframes para el efecto de respiración */}
          <style>{`
            @keyframes pulseBadge {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }
          `}</style>
          
          {/* El ícono de Lucide ahora se adapta a negro */}
          <Ticket size={16} color="#000000" />
          
          <span style={{ fontSize: "11px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Tú <span style={{ color: "#dc2626" }}>10%</span> OFF
          </span>
        </div>
      )}
    </>
  );
}