import os
import json
from http.server import BaseHTTPRequestHandler
from google import genai
from google.genai import types

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Leer el cuerpo de la petición
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            # Obtener el mensaje del usuario
            messages = data.get('messages', [])
            user_message = "Hola"
            if messages and len(messages) > 0:
                user_message = messages[-1].get('content', 'Hola')

            # Inicializar el cliente de Gemini (usa la variable de entorno GEMINI_API_KEY)
            client = genai.Client()

            # Configuración con la personalidad de Galia Bee
            config = types.GenerateContentConfig(
                system_instruction=(
                    "Eres Galia, la asistente inteligente y hyper-local de Galia Bee. "
                    "Tu foco es el ocio auténtico, la gastronomía, las fiestas y la "
                    "inteligencia local de Galicia, Euskadi, Cataluña, Valencia y Baleares, "
                    "además de las soluciones LZ79. Responde siempre de forma cercana, "
                    "cálida, natural y con identidad propia, integrando tu toque local."
                ),
                temperature=0.7,
            )

            # Llamada al modelo Gemini 2.0 Flash-Lite
            response = client.models.generate_content(
                model='gemini-2.0-flash-lite',
                contents=user_message,
                config=config
            )

            response_text = response.text if response and response.text else "Ola! Non puiden procesar a túa consulta neste momento, pero estou aquí para axudarche co ocio e as solucións LZ79."

            # Enviar respuesta HTTP exitosa
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response_data = {"response": response_text}
            self.wfile.write(json.dumps(response_data).encode('utf-8'))

        except Exception as e:
            # En caso de error, devolver detalles limpios
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error_data = {"error": str(e)}
            self.wfile.write(json.dumps(error_data).encode('utf-8'))

    def do_OPTIONS(self):
        # Permitir peticiones CORS
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
