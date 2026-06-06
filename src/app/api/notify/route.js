import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, total, buyer, items, date } = body;

    // Armamos la lista de productos en formato HTML
    const itemsHtml = items.map(item => `
      <li>
        <strong>${item.quantity}x ${item.name}</strong> 
        ${item.size ? `(Talla/Color: ${item.size})` : ''} 
        - $${item.price.toLocaleString('es-CL')}
      </li>
    `).join('');

    const htmlContent = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #000; color: #fff; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">💰 ¡Nueva Venta Confirmada!</h1>
          <p style="margin: 5px 0 0 0; color: #aaa;">Pedido #${orderId}</p>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="font-size: 18px; border-bottom: 2px solid #eee; padding-bottom: 5px;">Detalles del Cliente</h2>
          <p><strong>Hora de venta:</strong> ${date}</p>
          <p><strong>Nombre:</strong> ${buyer.name}</p>
          <p><strong>Email:</strong> ${buyer.email}</p>
          <p><strong>Dirección:</strong> ${buyer.address || 'Retiro en tienda / Sin dirección'}</p>

          <h2 style="font-size: 18px; border-bottom: 2px solid #eee; padding-bottom: 5px; margin-top: 30px;">Productos Vendidos</h2>
          <ul>
            ${itemsHtml}
          </ul>

          <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; text-align: right; border-radius: 5px;">
            <p style="font-size: 20px; margin: 0;"><strong>Total Pagado: $${total.toLocaleString('es-CL')}</strong></p>
          </div>
        </div>
      </div>
    `;

    const data = await resend.emails.send({
      from: 'Tienda Notificaciones <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL],
      subject: `🔥 Venta de $${total.toLocaleString('es-CL')} - ${buyer.name}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}