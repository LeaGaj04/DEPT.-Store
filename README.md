This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


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

## 🖥️ Interfaz de Usuario (UI)

<img width="1903" height="946" alt="image" src="https://github.com/user-attachments/assets/c2581190-9822-45b1-9c6f-d486e42c6b6e" />

**Captura de pantalla de la sección de inicio, diseñada con un enfoque minimalista y oscuro responsivo para la cultura streetwear.**
