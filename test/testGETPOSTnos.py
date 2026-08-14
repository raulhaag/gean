import tkinter as tk
from tkinter import scrolledtext, ttk
import urllib.request
import urllib.error
import json
import base64
import socket

orig_getaddrinfo = socket.getaddrinfo

def patched_getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
    if family == socket.AF_INET6 or family == 0:
        family = socket.AF_INET
    return orig_getaddrinfo(host, port, family, type, proto, flags)

socket.getaddrinfo = patched_getaddrinfo


def encode(input):
    encoded_bytes = base64.b64encode(input.encode("utf-8"))
    encoded_string = encoded_bytes.decode("utf-8").replace("/", "_")
    return encoded_string


def send_request():
    url = url_entry.get()
    method = method_var.get()

    # Obtener headers
    headers_raw = headers_text.get("1.0", tk.END).strip()
    headers = {}

    if headers_raw:
        for line in headers_raw.splitlines():
            if ": " in line:
                key, value = line.split(": ", 1)
                headers[key] = value

    # Obtener body
    body = body_text.get("1.0", tk.END).strip()

    try:
        # ---------------------------------
        # GET
        # ---------------------------------
        if method == "GET":
            request = urllib.request.Request(
                url,
                headers=headers,
                method="GET"
            )

            response = urllib.request.urlopen(request)

        # ---------------------------------
        # POST
        # ---------------------------------
        elif method == "POST":
            data = body.encode("utf-8")

            request = urllib.request.Request(
                url,
                data=data,
                headers=headers,
                method="POST"
            )

            response = urllib.request.urlopen(request)

        # ---------------------------------
        # PGET
        # ---------------------------------
        elif method == "PGET":
            encodedHeaders = encode(json.dumps(headers))

            proxy_url = (
                "http://127.0.0.1:8080/get/"
                + encode(url)
                + "/"
                + encodedHeaders
            )

            request = urllib.request.Request(
                proxy_url,
                method="GET"
            )

            response = urllib.request.urlopen(request)

        # ---------------------------------
        # PPOST
        # ---------------------------------
        elif method == "PPOST":
            encodedHeaders = encode(json.dumps(headers))

            proxy_url = (
                "http://127.0.0.1:8080/post/"
                + encode(url)
                + "/"
                + encodedHeaders
                + "/"
                + encode(body)
            )

            request = urllib.request.Request(
                proxy_url,
                method="GET"
            )

            response = urllib.request.urlopen(request)

        # ---------------------------------
        # Mostrar respuesta
        # ---------------------------------

        response_body = response.read().decode("utf-8", errors="replace")

        response_text.delete("1.0", tk.END)

        response_text.insert(
            tk.END,
            f"Status Code: {response.status}\n\n"
        )

        response_text.insert(
            tk.END,
            f"Request Headers:\n{dict(request.header_items())}\n\n"
        )

        response_text.insert(
            tk.END,
            f"Response Headers:\n{dict(response.headers.items())}\n\n"
        )

        response_text.insert(
            tk.END,
            f"Response Body:\n{response_body}"
        )

    except urllib.error.HTTPError as e:
        # HTTP 4xx / 5xx
        response_text.delete("1.0", tk.END)

        error_body = e.read().decode(
            "utf-8",
            errors="replace"
        )

        response_text.insert(
            tk.END,
            f"Status Code: {e.code}\n\n"
        )

        response_text.insert(
            tk.END,
            f"Response Headers:\n{dict(e.headers.items())}\n\n"
        )

        response_text.insert(
            tk.END,
            f"Response Body:\n{error_body}"
        )

    except urllib.error.URLError as e:
        response_text.delete("1.0", tk.END)
        response_text.insert(
            tk.END,
            f"URL Error: {e}\n"
        )

    except Exception as e:
        response_text.delete("1.0", tk.END)
        response_text.insert(
            tk.END,
            f"Error: {str(e)}"
        )


# Configuración de la ventana principal
root = tk.Tk()
root.title("HTTP Tester")

root.grid_columnconfigure(0, weight=1)
root.grid_rowconfigure(1, weight=1)
root.grid_rowconfigure(3, weight=1)
root.grid_rowconfigure(5, weight=1)

# Contenedor para URL, método y botón
frame = tk.Frame(root)
frame.grid(
    row=0,
    column=0,
    padx=10,
    pady=10,
    sticky="ew"
)

frame.grid_columnconfigure(1, weight=1)

# URL
tk.Label(
    frame,
    text="URL:"
).grid(
    row=0,
    column=0,
    padx=5,
    pady=5,
    sticky="w"
)

url_entry = tk.Entry(frame)

url_entry.grid(
    row=0,
    column=1,
    padx=5,
    pady=5,
    sticky="ew"
)

# Método
method_var = tk.StringVar(value="GET")

method_menu = ttk.Combobox(
    frame,
    textvariable=method_var,
    values=["GET", "POST", "PGET", "PPOST"],
    state="readonly",
    width=8
)

method_menu.grid(
    row=0,
    column=2,
    padx=5,
    pady=5
)

# Botón
send_button = tk.Button(
    frame,
    text="Send Request",
    command=send_request
)

send_button.grid(
    row=0,
    column=3,
    padx=5,
    pady=5
)

# Headers
tk.Label(
    root,
    text="Headers (key: value):"
).grid(
    row=1,
    column=0,
    sticky="w",
    padx=10,
    pady=5
)

headers_text = scrolledtext.ScrolledText(
    root,
    height=10
)

headers_text.grid(
    row=2,
    column=0,
    padx=10,
    pady=5,
    sticky="nsew"
)

# Body
tk.Label(
    root,
    text="Body (POST only):"
).grid(
    row=3,
    column=0,
    sticky="w",
    padx=10,
    pady=5
)

body_text = scrolledtext.ScrolledText(
    root,
    height=5
)

body_text.grid(
    row=4,
    column=0,
    padx=10,
    pady=5,
    sticky="nsew"
)

# Response
tk.Label(
    root,
    text="Response:"
).grid(
    row=5,
    column=0,
    sticky="w",
    padx=10,
    pady=5
)

response_text = scrolledtext.ScrolledText(
    root,
    height=15
)

response_text.grid(
    row=6,
    column=0,
    padx=10,
    pady=5,
    sticky="nsew"
)

root.mainloop()
