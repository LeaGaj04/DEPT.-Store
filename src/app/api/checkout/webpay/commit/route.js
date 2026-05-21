import { NextResponse } from "next/server";
import { 
  WebpayPlus, 
  Options, 
  IntegrationCommerceCodes, 
  IntegrationApiKeys, 
  Environment 
} from "transbank-sdk";

export async function GET(request) {
  // 1. Extraemos los parámetros que Transbank nos manda en la URL
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token_ws");
  const tbkToken = searchParams.get("TBK_TOKEN"); // Esto llega si el cliente anula la compra

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // 2. Si el cliente apretó "Anular" en la pantalla de Transbank
  if (tbkToken) {
    console.log("El cliente canceló la compra en Webpay");
    return NextResponse.redirect(`${baseUrl}/checkout?error=pago_cancelado`);
  }

  // 3. Si por algún motivo no llega el token principal
  if (!token) {
    return NextResponse.redirect(`${baseUrl}/checkout?error=token_invalido`);
  }

  try {
    // 4. Instanciamos la conexión con Transbank (Modo Prueba)
    const tx = new WebpayPlus.Transaction(
      new Options(
        IntegrationCommerceCodes.WEBPAY_PLUS,
        IntegrationApiKeys.WEBPAY,
        Environment.Integration
      )
    );

    // 5. 🔥 EL PASO MÁGICO: Confirmamos (Commit) la transacción con el token
    const commitResponse = await tx.commit(token);

    // 6. Evaluamos la respuesta de Transbank
    if (commitResponse.response_code === 0) {
      // ✅ PAGO APROBADO
      console.log("¡Pago exitoso con Webpay!", commitResponse);
      // Redirigimos a tu pantalla de éxito (puedes cambiar esta ruta a la que uses)
      return NextResponse.redirect(`${baseUrl}/success?metodo=webpay&orden=${commitResponse.buy_order}`);
    } else {
      // ❌ PAGO RECHAZADO (Ej: sin fondos, tarjeta bloqueada)
      console.log("Pago rechazado por el banco", commitResponse);
      return NextResponse.redirect(`${baseUrl}/checkout?error=pago_rechazado`);
    }

  } catch (error) {
    console.error("Error al confirmar el pago con Webpay:", error);
    return NextResponse.redirect(`${baseUrl}/checkout?error=error_sistema`);
  }
}