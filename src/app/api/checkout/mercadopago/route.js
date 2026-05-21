import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

// 1. Inicializamos MercadoPago con tu Token de Prueba (Asegúrate de tenerlo en tu .env.local)
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || "",
});

export async function POST(request) {
  try {
    const { items, payer } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
    }

    // 2. Mapeamos los productos del carrito al formato estricto de MercadoPago
    const itemsParaMercadoPago = items.map((item) => ({
      id: item.id,
      title: `${item.name} (Talla: ${item.selectedSize || 'U'})`,
      quantity: Number(item.quantity),
      unit_price: Number(item.price),
      currency_id: "CLP", // Pesos Chilenos
    }));

    // 3. Creamos la preferencia de pago
    const preference = new Preference(client);
    
    // URL base del proyecto (en desarrollo local siempre es localhost:3000)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const result = await preference.create({
      body: {
        items: itemsParaMercadoPago,
        payer: {
          name: payer?.nombre || "Cliente",
          surname: payer?.apellido || "Dept",
          email: payer?.email || "test@test.com",
          phone: {
            number: payer?.telefono || "912345678"
          }
        },
        // 🔥 AQUÍ ESTABA EL ERROR: Las URLs de retorno deben estar perfectamente definidas
        back_urls: {
          success: `${baseUrl}/checkout/success`,
          failure: `${baseUrl}/checkout/failure`,
          pending: `${baseUrl}/checkout/pending`,
        },
        // Si se aprueba, MercadoPago redirigirá automáticamente a la URL 'success' de arriba
        auto_return: "approved",
        // Desactiva métodos de pago que no quieras en el test si es necesario
        payment_methods: {
          excluded_payment_types: [
            { id: "ticket" } // Excluye pagos en efectivo por cupón si prefieres solo tarjetas rápidas
          ],
          installments: 12, // Máximo de cuotas permitidas
        },
      },
    });

    // 4. Devolvemos la URL oficial de MercadoPago (init_point) al frontend en formato JSON limpio
    return NextResponse.json({ url: result.init_point });

  } catch (error) {
    console.error("Error detallado en la API de MercadoPago:", error);
    return NextResponse.json(
      { error: error.message || "Error interno al procesar el pago" },
      { status: 500 }
    );
  }
}