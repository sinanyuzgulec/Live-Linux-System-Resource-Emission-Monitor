from flask import Flask, jsonify, Response
from flask_cors import CORS
import psutil
import time
import json

app = Flask(__name__)
CORS(app)

def get_processes():
    now = time.time()
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'username', 'cpu_percent', 'memory_info', 'create_time']):
        try:
            mem = proc.info['memory_info'].rss / (1024 ** 2)
            cpu = proc.info['cpu_percent']
            runtime = now - proc.info['create_time']
            power = cpu * 0.5 + mem * 0.01
            co2 = round((power * runtime / 3600000) * 0.475, 6)
            water = round((power * runtime / 3600000) * 1.8, 6)
            processes.append({
                "pid": proc.info['pid'],
                "name": proc.info['name'],
                "user": proc.info['username'],
                "cpu": cpu,
                "memory_mb": round(mem, 2),
                "runtime_sec": int(runtime),
                "power_w": round(power, 2),
                "co2_kg": co2,
                "water_l": water
            })
        except Exception:
            continue
    return processes

@app.route('/processes')
def processes_route():
    return jsonify(get_processes())  

@app.route('/stream')
def stream():
    def event_stream():
        while True:
            data = get_processes()
            yield f"data: {json.dumps(data)}\n\n" 
            time.sleep(3)
    return Response(event_stream(), mimetype="text/event-stream")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
