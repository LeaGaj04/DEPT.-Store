import { NextResponse } from "next/server";
// 🔥 CORRECCIÓN: Importamos las herramientas de configuración de entorno
import { 
  WebpayPlus, 
  Options, 
  IntegrationCommerceCodes, 
  IntegrationApiKeys, 
  Environment 
} from "transbank-sdk";

export async function POST(request) {
  try {
    const { items } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // 1. Calculamos el monto total
    const amount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // 2. Transbank exige un número de orden y sesión únicos
    const buyOrder = "ORDEN-" + Math.floor(Math.random() * 10000000);
    const sessionId = "SESION-" + Math.floor(Math.random() * 10000000);
    
    // 3. URL de retorno
    const returnUrl = `${baseUrl}/api/checkout/webpay/commit`;

    // 4. 🔥 CORRECCIÓN: Le pasamos explícitamente las opciones de "Modo Prueba"
    const tx = new WebpayPlus.Transaction(
      new Options(
        IntegrationCommerceCodes.WEBPAY_PLUS,
        IntegrationApiKeys.WEBPAY,
        Environment.Integration
      )
    );

    const createResponse = await tx.create(
      buyOrder,
      sessionId,
      amount,
      returnUrl
    );

    // 5. Transbank nos devuelve una URL y un Token
    return NextResponse.json({ 
      url: createResponse.url, 
      token: createResponse.token 
    });

  } catch (error) {
    console.error("Error crítico en Webpay:", error);
    return NextResponse.json(
      { error: "No se pudo iniciar el pago con Transbank" },
      { status: 500 }
    );
  }
}