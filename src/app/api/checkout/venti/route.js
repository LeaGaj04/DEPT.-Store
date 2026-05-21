import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { items, payer } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
    }

    // 1. Obtenemos la llave secreta de Venti
    const VENTIPAY_SECRET = process.env.VENTIPAY_SECRET_KEY || "";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // 2. Mapeamos los items (dejamos nombre, precio y cantidad limpios)
    const ventiItems = items.map((item) => ({
      name: `${item.name} (Talla: ${item.selectedSize || 'U'})`,
      price: Number(item.price), 
      quantity: Number(item.quantity)
    }));

    // 3. Hacemos la petición a Ventipay
    const authString = Buffer.from(`${VENTIPAY_SECRET}:`).toString('base64');
    
    const response = await fetch("https://api.ventipay.com/v1/checkouts", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authString}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        currency: "CLP", // 🔥 EL SECRETO ESTABA AQUÍ: Va a nivel general de la compra
        items: ventiItems,
        success_url: `${baseUrl}/checkout/success`,
        cancel_url: `${baseUrl}/checkout/failure`,
        payer: {
            email: payer?.email || "cliente@test.com"
        }
      })
    });

    const data = await response.json();

    // 4. Devolvemos la URL
    if (response.ok && data.checkout_url) {
      return NextResponse.json({ url: data.checkout_url });
    } else if (response.ok && data.url) {
      return NextResponse.json({ url: data.url });
    } else {
      console.error("Respuesta de Venti:", data);
      return NextResponse.json(
        { error: "No se pudo generar el checkout de Ventipay." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error crítico en la API de Venti:", error);
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}