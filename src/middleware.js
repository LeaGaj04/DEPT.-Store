import { NextResponse } from "next/server";

export function middleware(request) {
  // Obtenemos la ruta a la que intenta ingresar el usuario
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Supongamos que guardas el token o estado de admin en una cookie
  const isAdminCookie = request.cookies.get("admin_session"); 

  // Si intenta entrar al dashboard sin estar logueado como admin
  if (pathname.startsWith("/admin/dashboard") && !isAdminCookie) {
    // Lo redireccionamos directo al login del panel
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Si está todo en orden o va a otra ruta, permitimos el paso
  return NextResponse.next();
}

// Configuración para que el middleware SOLO se ejecute en las rutas de administración
export const config = {
  matcher: ["/admin/:path*"],
};