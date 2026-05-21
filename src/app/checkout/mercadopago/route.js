import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { items, orderId } = await request.json();

    // 1. Transformamos tus productos al formato estricto que exige MercadoPago
    const mpItems = items.map((item) => ({
      id: item.id,
      title: `${item.name} - Talla ${item.size || "U"}`,
      quantity: Number(item.quantity),
      unit_price: Number(item.price),
      currency_id: "CLP", // Pesos Chilenos
    }));

    // 2. Configuramos la preferencia de pago
    const preference = {
      items: mpItems,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?orderId=${orderId}`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/pending`,
      },
      auto_return: "approved",
      external_reference: orderId, // Vinculamos el pago al ID de tu Firebase
    };

    // 3. Llamamos a la API de MercadoPago usando tu Token Secreto
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al crear la preferencia en MercadoPago");
    }

    // 4. Le devolvemos al frontend la URL de pago (init_point)
    return NextResponse.json({ url: data.init_point });

  } catch (error) {
    console.error("Error en la API de MercadoPago:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}