# LendaPet Store — tienda de piensos para perros (demo)

Proyecto de storefront **independiente**, con catálogo basado en referencias reales de piensos **Lenda**, filtros, búsqueda, fichas, lista/carrito persistente en el navegador y diseño responsive.

> **Estado:** demostración navegable, **no** e-commerce listo para cobrar. Sin pedidos, pasarela de pagos, almacén, contacto comercial ni integración oficial con Lenda. No representa a Lenda Pet Food SL.

## Qué incluye

- Sitio estático HTML/CSS/JavaScript, sin dependencias ni base de datos.
- Ocho referencias públicas de Lenda organizadas por cachorros, adultos, minis y sénior.
- Búsqueda tolerante a tildes, ordenación y filtros.
- Fichas de producto, carrito y control de cantidades; el carrito se conserva en `localStorage`.
- «Copiar mi selección» para llevar un listado orientativo; enlaces al sitio oficial para información, precio real y compras.
- SVG de marca **no oficial**, packs ilustrativos propios dibujados con CSS y fotos externas ilustrativas de perros (Unsplash).
- Páginas fáciles de publicar en GitHub Pages y prueba automatizada de datos.

## Verla localmente

En el directorio del proyecto:

```bash
python3 -m http.server 4173
# Abre http://localhost:4173
```

O abre `index.html` directamente en un navegador moderno.

## Crear nuevo repositorio GitHub

1. Entra en https://github.com/new, cuenta `BoyuMento97`.
2. Nombre sugerido: `lendapet-store`. Elige visibilidad. **No** marques «Add a README» o `.gitignore` al crearlo.
3. Descomprime este paquete y, dentro de la carpeta `lendapet-store`:

```bash
git init
git add .
git commit -m "feat: crear catálogo LendaPet Store"
git branch -M main
git remote add origin https://github.com/BoyuMento97/lendapet-store.git
git push -u origin main
```

Otra opción: crea el repositorio vacío y vuelve a ChatGPT para que se puedan añadir archivos usando la conexión de GitHub.

## Publicar en GitHub Pages

El proyecto incluye `.github/workflows/deploy-pages.yml` para desplegar tras cada `push` a `main`.

1. En el repo, abre **Settings → Pages**.
2. En **Build and deployment → Source**, selecciona **GitHub Actions**.
3. En **Actions**, comprueba el resultado de «Deploy LendaPet Store to Pages».
4. La web quedará accesible en `https://boyumento97.github.io/lendapet-store/` cuando se despliegue correctamente. No se considera publicada antes de verificar el workflow.

Para dominio propio: **Settings → Pages → Custom domain**, y configura DNS.

## Editar productos

Modifica `products.js`. Campos:

- `name`, `family`, `category`, `protein`, `tags`: contenido y filtros.
- `priceFrom`: **importe de referencia**, nunca precio final de venta.
- `url`: enlace a la ficha/producto/búsqueda oficial.
- `color`, `pack`, `ink`, `accent`, `motif`: colores del pack **ilustrativo**.

Fuentes de referencia consultadas el 9 de octubre de 2026:

- https://shop.lenda.net/collections/alimento-para-perros
- https://shop.lenda.net/pages/alimento-natural-para-perros

Los precios públicos y composiciones pueden cambiar, variar por formato y país, y la marca puede cambiar enlaces. **Verificar todo antes de ofertar productos.**

## Pendiente para convertirla en comercio real

- Establecer identidad legal del vendedor, CIF/NIF, domicilio profesional, contacto, aviso legal, política de privacidad/cookies, desistimiento, devoluciones, envíos y condiciones de contratación conforme a la normativa aplicable.
- Confirmar acuerdo de distribución o reventa, y permiso de uso de logotipos e imágenes de producto oficiales.
- Configurar variantes (peso, SKU/EAN, precio final IVA incluido), stock y logística.
- Conectar Stripe u otro proveedor de pago **desde un backend**, con precios siempre verificados en el servidor, gestión de pedidos, webhooks validados, notificaciones y protección contra pedidos duplicados.
- Actualizar el texto «demostración» y eliminar enlaces externos como canal de compra solo cuando la tienda propia esté operativa.
- Utilizar imágenes con derechos de uso para comercialización. Las imágenes de perros actuales son remotas y su disponibilidad/licencia debe revisarse para uso comercial.

## Privacidad de la demo

Los artículos elegidos se guardan solo en el almacenamiento local del navegador. No se envía información del cliente a ningún servidor de LendaPet; el botón de consulta externa lleva a dominios oficiales de Lenda.

## Licencias y marcas

El código se entrega para uso de quien solicitó el proyecto, **sin licencia de software libre**. Los nombres y signos «Lenda» pertenecen a sus titulares. El diseño de los envases es una ilustración genérica, **no una reproducción exacta de packaging oficial**.
