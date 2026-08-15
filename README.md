# LZ79 · lz79-web

Sitio y frontend para el ecosistema "Galia" (chat + demos). Este repositorio contiene la web estática y la API mínima que comunica con Google Gemini.

Demo de despliegue (Netlify)
- Panel de deploys: https://app.netlify.com/projects/gregarious-phoenix-9ec880/deploys
- URL pública (probable): https://gregarious-phoenix-9ec880.netlify.app

Resumen
- Frontend: index.html (HTML + JS).
- Backend/API: `api/chat.js` — endpoint POST `/api/chat` que usa la variable de entorno `GEMINI_API_KEY` para llamar a Google Gemini.

Contenido del README
1. Requisitos
2. Instalación y ejecución local
3. Variables de entorno
4. Despliegue en Netlify
5. Sustituciones de Vercel → Netlify (nota)
6. Pruebas
7. Búsqueda de referencias a Vercel
8. Contribuciones

---

1) Requisitos
- Node.js >= 18
- npm o pnpm
- (Opcional) Netlify CLI si quieres gestionar variables y desplegar desde CLI

2) Instalación y ejecución local

Clona el repo y arranca en modo desarrollo:

```bash
git clone https://github.com/lz79freelance/lz79-web.git
cd lz79-web
npm install
# Si el proyecto no tiene script start/dev, arranca con un servidor estático o con tu stack habitual.
npm run dev
```

Si no hay script `dev` configurado, puedes usar `serve` o `http-server` para servir `index.html` localmente:

```bash
npx serve . -p 3000
```

3) Variables de entorno

La API (archivo `api/chat.js`) requiere la variable `GEMINI_API_KEY` para funcionar. No incluyas la clave en el frontend.

Localmente:

```bash
export GEMINI_API_KEY="tu_valor_aqui"   # macOS / Linux
setx GEMINI_API_KEY "tu_valor_aqui"     # Windows (PowerShell/Command Prompt difiere)
```

En Netlify (UI): Site → Site settings → Build & deploy → Environment → Add variable

En Netlify (CLI):

```bash
netlify env:set GEMINI_API_KEY <valor> --site <site-id>
```

4) Despliegue en Netlify

- Asegúrate de que el repositorio está conectado al sitio en Netlify.
- Configura la variable `GEMINI_API_KEY` en Environment → Add variable.
- Fuerza un deploy con limpieza de caché si ves contenido antiguo: en Netlify → Deploys → Trigger deploy → Clear cache and deploy site.

5) Nota sobre Vercel → Netlify

He reemplazado las menciones a "Vercel" por "Netlify" en el código y en los mensajes de error más comunes (por ejemplo `api/chat.js` y `index.html`).

Importante: la sección "Website" / "About" del repositorio en GitHub no forma parte del árbol de archivos; si ves un enlace a vercel.app en la página del repo, actualízalo manualmente:

- Ve a la página del repo en GitHub → haz clic en el icono del lápiz junto al Website (o Settings → Options → Repository details → Website) y cambia la URL a la URL pública de Netlify (por ejemplo `https://gregarious-phoenix-9ec880.netlify.app`) o a tu dominio.

6) Pruebas rápidas (curl)

Prueba la API localmente (sin clave setada devolverá error):

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role":"user","content":"Hola"}], "language":"es"}'
```

Respuesta esperada:

```json
{ "reply": "..." }
```

Si la variable no está configurada la API responderá con error indicando que `GEMINI_API_KEY` no está configurada (ahora el mensaje indica Netlify/variables de entorno).

7) Buscar referencias a Vercel

Para revisar si quedan menciones a Vercel en tu copia local:

```bash
git pull origin main
grep -Rni "vercel" . || echo "No se encontraron menciones a vercel en archivos de texto."
```

Si encuentras archivos con `vercel` y quieres que los cambie por la URL de Netlify, puedo hacerlo y crear un commit.

8) Contribuciones

Si quieres añadir mejoras, abre un issue o manda un PR. Algunas ideas:
- Añadir un build step (npm script) y configurarlo en Netlify.
- Añadir tests y linter.
- Separar el frontend en una app con bundler si quieres funcionalidades más complejas.

---

Contacto
- Autor/maintainer: lz79freelance

Licencia
- Añade aquí la licencia que prefieras (por ejemplo MIT). Actualmente no hay archivo LICENSE en el repo.
