# lz79-web — Deploy notes

Breve guía rápida para desplegar y probar este repositorio en Vercel.

## Estado actual
- `index.html` ha sido restaurado a la versión previa al cambio de Netlify.
- `vercel.json` está configurado en `main` para:
  - mantener la función Python `api/chat.py` (build `@vercel/python`),
  - exponer la ruta `/api/chat` hacia `api/chat.py`,
  - servir `index.html` como fallback SPA para todas las rutas.
- `api/chat.py` es un handler mínimo (placeholder) que responde con un mensaje indicando que el backend de chat está deshabilitado en Vercel. No requiere dependencias externas.

## Despliegue en Vercel (rápido)
1. Conecta tu cuenta de GitHub con Vercel si no está hecha.
2. Importa el repositorio `lz79freelance/lz79-web` en Vercel.
3. Asegúrate en la configuración del proyecto de lo siguiente:
   - Framework Preset: `Other (Static)` a menos que tengas un paso de build.
   - Build Command: (vacío si no hay build).
   - Output Directory: `.` (o `public`/`dist` si tu sitio lo usa).
   - Habilita "Clear build cache" si es necesario.
4. Añade las variables de entorno secretas en Project Settings → Environment Variables:
   - `GEMINI_API_KEY` — secreto (NO exponer en frontend).
   - `CHAT_ENDPOINT` — opcional (por defecto `/api/chat`).
5. Despliega (Deploy). Revisa los logs de build y de funciones.

## API `api/chat` (placeholder)
- `api/chat.py` es un handler mínimo que responde JSON con código 200 y el cuerpo:

  { "error": "Chat backend temporarily disabled on Vercel. Use the static site." }

- No necesita `requirements.txt` si lo mantienes así. Si añades dependencias Python para la función, añade `requirements.txt` en la raíz con los paquetes necesarios.

## Probar la API (ejemplo)
- Desde la terminal (una vez desplegado):

  curl -X POST https://<your-vercel-url>/api/chat -H "Content-Type: application/json" -d '{"messages": [{"role":"user","content":"Hola"}], "language":"es"}'

- Respuesta esperada (placeholder):

  { "error": "Chat backend temporarily disabled on Vercel. Use the static site." }

## Recomendaciones de seguridad y producción
- Nunca incluyas la `GEMINI_API_KEY` u otras claves secretas en el frontend. Usa variables de entorno del proyecto en Vercel y haz las llamadas a la API desde el servidor (Serverless Function) que tenga acceso a la clave.
- Implementa límites por usuario en el backend (no solo en el cliente) para evitar abusos.
- Si más adelante implementas la integración con Gemini u otro proveedor, añade `requirements.txt` con las dependencias y actualiza `api/chat.py` para usar la clave desde `os.environ`.

## Si quieres que haga más
- Puedo crear un ejemplo mínimo de `api/chat.py` que llame a una API real (necesitaré confirmar el proveedor y la forma de autenticar). 
- Puedo crear una rama + PR con cambios (por ejemplo: agregar `requirements.txt`, un handler Python más completo y tests básicos) si prefieres revisar antes de mergear.

Si quieres que añada `requirements.txt` o un ejemplo de handler que use una API de LLM (sin la clave), dime proveedor (OpenAI/Gemini/otro) y lo preparo en una rama y PR.
