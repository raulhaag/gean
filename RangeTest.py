import tkinter as tk
from tkinter import ttk
import requests
import threading
import os
import configparser

# Nombre del archivo de configuración
config_file = 'config.ini'

# Leer el archivo de configuración o crear uno nuevo con valores por defecto
config = configparser.ConfigParser()
if not os.path.exists(config_file):
    config['CONFIG'] = {
        'url': 'https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4',
        'start': '0',
        'end': ''
    }
    with open(config_file, 'w') as f:
        config.write(f)
else:
    config.read(config_file)

# Obtener los valores del archivo de configuración
default_url = config.get('CONFIG', 'url')
default_start = config.get('CONFIG', 'start')
default_end = config.get('CONFIG', 'end')

def download_file(url, start, end):
    headers = {'Range': f'bytes={start}-{end}'}
    response = requests.get(url, headers=headers, stream=True)

    total_size = int(response.headers.get('content-length', 0))
    block_size = 1024
    downloaded_size = 0

    with open('downloaded_file.mp4', 'wb') as f:
        for data in response.iter_content(block_size):
            f.write(data)
            downloaded_size += len(data)
            progress.set(downloaded_size / total_size * 100)
            root.update()

    # Mostrar el contenido descargado en el visor hex/ascii
    with open('downloaded_file.mp4', 'rb') as f:
        content = f.read()

    # Convertir el contenido en formato hexadecimal y dividirlo en líneas
    hex_lines = []
    for i in range(0, len(content), 16):
        hex_line = ' '.join(f"{byte:02X}" for byte in content[i:i+16])
        ascii_line = ''.join(chr(b) if 32 <= b < 127 else '.' for b in content[i:i+16])
        hex_lines.append(f"{i:08X}: {hex_line}\t{ascii_line}")

    hex_content = '\n'.join(hex_lines)
    text_viewer.delete('1.0', tk.END)
    text_viewer.insert(tk.END, hex_content)

def download_range():
    url = url_entry.get()
    start = start_entry.get()
    end = end_entry.get()

    if not start:
        start = 0

    # Guardar los valores ingresados en el archivo de configuración
    config.set('CONFIG', 'url', url)
    config.set('CONFIG', 'start', start)
    config.set('CONFIG', 'end', end)
    
    with open(config_file, 'w') as f:
        config.write(f)

    threading.Thread(target=download_file, args=(url, start, end)).start()

# Crear la ventana principal
root = tk.Tk()
root.title("Descargar Rango de Archivo")

# Variables para los campos de entrada
url = tk.StringVar(value=default_url)
start = tk.StringVar(value=default_start)
end = tk.StringVar(value=default_end)

# URL
url_label = tk.Label(root, text="URL:")
url_label.pack()
url_entry = tk.Entry(root, textvariable=url, width=50)
url_entry.pack()

# Start
start_label = tk.Label(root, text="Start:")
start_label.pack()
start_entry = tk.Entry(root, textvariable=start, width=10)
start_entry.pack()

# End
end_label = tk.Label(root, text="End:")
end_label.pack()
end_entry = tk.Entry(root, textvariable=end, width=10)
end_entry.pack()

# Botón de descarga
download_button = tk.Button(root, text="Descargar", command=download_range)
download_button.pack()

# Barra de progreso
progress = tk.DoubleVar()
progress_bar = ttk.Progressbar(root, variable=progress, length=200)
progress_bar.pack()

# Textarea para visor hex/ascii con scrollbar
viewer_label = tk.Label(root, text="Visor Hex/ASCII:")
viewer_label.pack()

text_viewer_frame = tk.Frame(root)
text_viewer_frame.pack()

text_viewer = tk.Text(text_viewer_frame, wrap=tk.NONE, height=20, width=80)
text_viewer.pack(side=tk.LEFT)

scrollbar = tk.Scrollbar(text_viewer_frame, command=text_viewer.yview)
scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
text_viewer.config(yscrollcommand=scrollbar.set)

root.mainloop()
