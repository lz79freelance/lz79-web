from http.server import BaseHTTPRequestHandler
import json
import os
from google import genai

# Inicializamos el cliente
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)
        
        # Respuesta simple de prueba
        response = client.models.generate_content(
            model='gemini-2.0-flash-lite',
            contents=data.get('messages', [{'content': 'Hola'}])[-1]['content']
        )
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"reply": response.text}).encode('utf-8'))
