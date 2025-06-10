import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [processes, setProcesses] = useState([]);

  useEffect(() => {
    const source = new EventSource('http://localhost:5000/stream');
    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setProcesses(data);
    };
    return () => source.close();
  }, []);

  return (
    <div className="App">
      <h1>Sistem İzleme Paneli</h1>
      <table>
        <thead>
          <tr>
            <th>PID</th>
            <th>Ad</th>
            <th>Kullanıcı</th>
            <th>CPU %</th>
            <th>RAM (MB)</th>
            <th>Süre (sn)</th>
            <th>Güç (W)</th>
            <th>CO₂ (kg)</th>
            <th>Su (L)</th>
          </tr>
        </thead>
        <tbody>
          {processes.map(proc => (
            <tr key={proc.pid}>
              <td>{proc.pid}</td>
              <td>{proc.name}</td>
              <td>{proc.user}</td>
              <td>{proc.cpu}</td>
              <td>{proc.memory_mb}</td>
              <td>{proc.runtime_sec}</td>
              <td>{proc.power_w}</td>
              <td>{proc.co2_kg}</td>
              <td>{proc.water_l}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
