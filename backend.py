from flask import Flask, request, jsonify
import socket
import threading
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def scan_port(ip, port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(1)
    result = sock.connect_ex((ip, port))
    sock.close()
    return port if result == 0 else None

# API endpoint to scan ports
@app.route('/scan', methods=['POST'])
def scan_ports():
    data = request.get_json()
    ip = data['ip']
    start_port = int(data['start_port'])
    end_port = int(data['end_port'])

    open_ports = []
    threads = []

    for port in range(start_port, end_port + 1):
        thread = threading.Thread(target=lambda p=port: open_ports.append(scan_port(ip, p)))
        thread.start()
        threads.append(thread)  # Fixed: Append to 'threads' list, not 'thread'

    for thread in threads:
        thread.join()

    open_ports = [p for p in open_ports if p is not None]
    return jsonify({'open_ports': open_ports})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)