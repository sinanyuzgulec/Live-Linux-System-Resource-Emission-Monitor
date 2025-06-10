from flask import Flask, jsonify, Response
from flask_cors import CORS
import psutil, time, json

app = Flask(__name__)
CORS(app)

def estimate_power(cpu_pct, mem_mb):
    return cpu_pct * 0.5 + mem_mb * 0.01  # Basit tahmin

def calc_emission(watts, seconds):
    kwh = watts * seconds / 3600000
    return {
        "co2_kg": round(kwh * 0.475, 6),
        "water_l": round(kwh * 1.8, 6)
    }

@app.route('/processes')
def get_processes():
    now = time.time()
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'username', 'cpu_percent', 'memory_info', 'create_time']):
        try:
            mem = proc.info['memory_info'].rss / (1024 ** 2)
            cpu = proc.info['cpu_percent']
            power = estimate_power(cpu, mem)
            runtime = now - proc.info['create_time']
            emissions = calc_emission(power, runtime)
            processes.append({
                "pid": proc.info['pid'],
                "name": proc.info['name'],
                "user": proc.info['username'],
                "cpu": cpu,
                "memory_mb": round(mem, 2),
                "runtime_sec": int(runtime),
                "power_w": round(power, 2),
                "co2_kg": emissions['co2_kg'],
                "water_l": emissions['water_l']
            })
        except Exception:
            continue
    return jsonify(processes)

@app.route('/stream')
def stream():
    def event_stream():
        while True:
            data = get_processes().get_data(as_text=True)
            yield f"data: {data}\n\n"
            time.sleep(3)
    return Response(event_stream(), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
