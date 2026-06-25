# DEPT. Store

🔗 **[Ver Demo en Vivo (Vercel)](https://dept-theta.vercel.app)**

## 📌 Sobre el Proyecto
**DEPT. Store** es un e-commerce minimalista y de alto rendimiento diseñado para una marca de streetwear chilena. Desarrollado con un enfoque en una estética de tonos oscuros y siluetas *boxy fit*, la plataforma ofrece una experiencia de compra fluida mediante un catálogo público interactivo y un panel de administración protegido para gestionar el stock y el inventario en tiempo real.

<img width="1898" height="874" alt="image" src="https://github.com/user-attachments/assets/d6b44137-b784-42d7-b48b-7ed4a06a298b" />

## 🚀 Funcionalidades Principales
- **Catálogo Dinámico:** Visualización de productos de streetwear con filtros y detalles.
- **Panel de Administración (Admin Dashboard):** Gestión segura de inventario, actualización de stock y revisión de pedidos en tiempo real.
- **Carrito de Compras:** Sistema de carrito persistente y fluido usando Context API.
- **Pasarelas de Pago:** Integración escalable preparada para MercadoPago, Venti y Webpay.
- **Responsive Design:** Interfaz completamente adaptada a dispositivos móviles, tablets y escritorio.
- **Base de Datos en Tiempo Real:** Sincronización rápida y segura del inventario.

## 🛠️ Tecnologías Utilizadas
- **Framework:** [Next.js (App Router)](https://nextjs.org/)
- **Librería UI:** [React](https://reactjs.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Base de Datos y Backend:** [Firebase](https://firebase.google.com/)
- **Lenguaje:** JavaScript
- **Despliegue:** [Vercel](https://vercel.com/)

## ⚙️ Cómo ejecutarlo localmente

Sigue estos pasos para correr el proyecto en tu entorno de desarrollo local:

1. **Clona el repositorio:**
   ```bash
   git clone [https://github.com/LeaGaj04/DEPT.-Store.git](https://github.com/LeaGaj04/DEPT.-Store.git)
   cd DEPT.-Store

   Instala las dependencias:
   Puedes usar npm, yarn, pnpm o bun:

   Bash
   npm install
   
   Configura las variables de entorno:
   Crea un archivo .env.local en la raíz del proyecto y agrega tus credenciales correspondientes a Firebase y las pasarelas de pago.

   Inicia el servidor de desarrollo:

   Bash
   npm run dev
   
   Abre la aplicación:
   Navega a http://localhost:3000 en tu navegador para ver la tienda en funcionamiento.


## Mapa del Proyecto

El proyecto está estructurado utilizando **Next.js (App Router)**, separando de forma clara la lógica de rutas, componentes visuales, estados globales y las integraciones con servicios externos (Firebase y pasarelas de pago).

```text
├── 📁 public/               # Archivos estáticos, imágenes de marca y recursos locales
└── 📁 src/
    ├── 📁 app/              # Sistema de enrutamiento principal (Next.js App Router)
    │   ├── 📁 admin/        
    │   │   ├── 📁 dashboard/# Panel de administración (Pedidos recibidos, reportes, etc.)
    │   │   └── 📁 login/    
    │   ├── 📁 api/          # Capa de Backend / Endpoints de API locales
    │   │   ├── 📁 checkout/ # Controladores para el procesamiento de pagos
    │   │   │   ├── 📁 mercadopago/ 
    │   │   │   ├── 📁 venti/       
    │   │   │   └── 📁 webpay/      
    │   │   └── 📁 notify/   
    │   ├── 📁 ayuda/        
    │   ├── 📁 carrito/      
    │   ├── 📁 catalogo/     
    │   ├── 📁 checkout/     
    │   │   ├── 📁 failure/  
    │   │   ├── 📁 pending/  
    │   │   └── 📁 success/  
    │   ├── 📁 login/        
    │   ├── 📁 perfil/       
    │   ├── 📁 producto/    
    │   ├── 📁 registro/     
    │   ├── globals.css      
    │   ├── layout.js        
    │   └── page.js         
    │
    ├── 📁 components/       
    │   ├── Footer.jsx       
    │   ├── Header.jsx       
    │   ├── InstagramMarquee.jsx
    │   ├── InventoryChart.jsx 
    │   ├── ProductCard.jsx  
    │   ├── ToasterProvider.jsx 
    │   ├── TopBar.jsx       
    │   └── WelcomeDiscount.jsx 
    │
    ├── 📁 context/          
    │   └── CartContext.jsx  
    │
    ├── 📁 data/             
    │   └── mockData.js
    │
    └── 📁 lib/              
        └── firebase.js
```

### 🖥️ Interfaz de Usuario (UI)


<img width="1904" height="945" alt="image" src="https://github.com/user-attachments/assets/36f38270-3525-42fb-85a4-c85e8113dd1a" />


*Captura de pantalla de la sección de inicio, diseñada con un enfoque minimalista, oscuro y responsivo para la cultura streetwear.*
