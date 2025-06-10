import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [processes, setProcesses] = useState([]);
  const [totalCo2, setTotalCo2] = useState(0);
  const [totalWater, setTotalWater] = useState(0);

  useEffect(() => {
    const source = new EventSource('http://localhost:5000/stream');
    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      data.sort((a, b) => b.co2_kg - a.co2_kg);

      const co2Sum = data.reduce((acc, cur) => acc + cur.co2_kg, 0);
      const waterSum = data.reduce((acc, cur) => acc + cur.water_l, 0);

      setTotalCo2(co2Sum.toFixed(4));
      setTotalWater(waterSum.toFixed(2));
      setProcesses(data);
    };
    return () => source.close();
  }, []);

  return (
    <div className="App">
      <h1>🌍 System Resource & Emission Monitor</h1>

      {/* sign */}
      <div className="signature">
        Developed by{' '}
        <a href="https://github.com/sinanyuzgulec" target="_blank" rel="noopener noreferrer">
          Sinan Yüzgüleç (GitHub)
        </a>{' '}
        |{' '}
        <a href="https://www.linkedin.com/in/sinan-yuzgulec/" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </div>

      <div className="summary">
        <p><strong>🟢 Total CO₂:</strong> {totalCo2} kg</p>
        <p><strong>💧 Total Water:</strong> {totalWater} L</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>PID</th>
            <th>Name</th>
            <th>User</th>
            <th>CPU %</th>
            <th>RAM (MB)</th>
            <th>Runtime (s)</th>
            <th>Power (W)</th>
            <th>CO₂ (kg) 🔽</th>
            <th>Water (L)</th>
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
              <td className={proc.co2_kg > 0.05 ? 'high-co2' : 'low-co2'}>
                {proc.co2_kg}
              </td>
              <td>{proc.water_l}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
