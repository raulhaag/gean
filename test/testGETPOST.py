import tkinter as tk
from tkinter import scrolledtext, ttk
import requests

def send_request():
    # Obtener la URL
    url = url_entry.get()
    
    # Obtener el método seleccionado
    method = method_var.get()
    
    # Obtener los headers en formato de texto y convertirlos a un diccionario
    headers_raw = headers_text.get("1.0", tk.END).strip()
    headers = {}
    if headers_raw:
        for line in headers_raw.splitlines():
            if ": " in line:
                key, value = line.split(": ", 1)
                headers[key] = value
    
    # Obtener el cuerpo (para POST)
    body = body_text.get("1.0", tk.END).strip()
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, headers=headers, data=body)
        
        # Mostrar la respuesta
        response_text.delete("1.0", tk.END)
        response_text.insert(tk.END, f"Status Code: {response.status_code}\n\n")
        response_text.insert(tk.END, f"Request Headers:\n{response.request.headers}\n\n")
        response_text.insert(tk.END, f"Response Headers:\n{response.headers}\n\n")
        response_text.insert(tk.END, f"Response Body:\n{response.text}")
    except Exception as e:
        response_text.delete("1.0", tk.END)
        response_text.insert(tk.END, f"Error: {str(e)}")

# Configuración de la ventana principal
root = tk.Tk()
root.title("HTTP Tester")

# Configuración de la cuadrícula para hacer que las columnas sigan el tamaño de la ventana
root.grid_columnconfigure(0, weight=1)
root.grid_rowconfigure(1, weight=1)
root.grid_rowconfigure(3, weight=1)
root.grid_rowconfigure(5, weight=1)

# Contenedor para URL, método y botón de envío
frame = tk.Frame(root)
frame.grid(row=0, column=0, padx=10, pady=10, sticky="ew")

frame.grid_columnconfigure(1, weight=1)

# Etiqueta y entrada para la URL
tk.Label(frame, text="URL:").grid(row=0, column=0, padx=5, pady=5, sticky="w")
url_entry = tk.Entry(frame)
url_entry.grid(row=0, column=1, padx=5, pady=5, sticky="ew")

# Selección del método (GET o POST)
method_var = tk.StringVar(value="GET")
method_menu = ttk.Combobox(frame, textvariable=method_var, values=["GET", "POST"], state="readonly", width=8)
method_menu.grid(row=0, column=2, padx=5, pady=5)

# Botón para enviar la solicitud
send_button = tk.Button(frame, text="Send Request", command=send_request)
send_button.grid(row=0, column=3, padx=5, pady=5)

# Campo para ingresar los headers
tk.Label(root, text="Headers (key: value):").grid(row=1, column=0, sticky="w", padx=10, pady=5)
headers_text = scrolledtext.ScrolledText(root, height=10)
headers_text.grid(row=2, column=0, padx=10, pady=5, sticky="nsew")

# Campo para ingresar el cuerpo (solo en POST)
tk.Label(root, text="Body (POST only):").grid(row=3, column=0, sticky="w", padx=10, pady=5)
body_text = scrolledtext.ScrolledText(root, height=5)
body_text.grid(row=4, column=0, padx=10, pady=5, sticky="nsew")

# Área para mostrar la respuesta
tk.Label(root, text="Response:").grid(row=5, column=0, sticky="w", padx=10, pady=5)
response_text = scrolledtext.ScrolledText(root, height=15)
response_text.grid(row=6, column=0, padx=10, pady=5, sticky="nsew")

root.mainloop()
