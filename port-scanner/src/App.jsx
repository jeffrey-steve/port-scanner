import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [ip, setIp] = useState('');
  const [startPort, setStartPort] = useState('');
  const [endPort, setEndPort] = useState('');
  const [results, setResults] = useState([]);

  const handleScan = async () => {
    try {
      const response = await axios.post('http://localhost:5000/scan', {
        ip,
        start_port: startPort,
        end_port: endPort,
      });
      setResults(response.data.open_ports);
    } catch (error) {
      console.error('Error scanning ports:', error);
      setResults(['Error occurred']);
    }
  };

  return (
    <div className="App">
      <h1>Port Scanner</h1>
      <div>
        <label>Target IP: </label>
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="e.g., 192.168.1.5"
        />
      </div>
      <div>
        <label>Start Port: </label>
        <input
          type="number"
          value={startPort}
          onChange={(e) => setStartPort(e.target.value)}
          placeholder="e.g., 1"
        />
      </div>
      <div>
        <label>End Port: </label>
        <input
          type="number"
          value={endPort}
          onChange={(e) => setEndPort(e.target.value)}
          placeholder="e.g., 100"
        />
      </div>
      <button onClick={handleScan}>Scan Ports</button>
      <h2>Results</h2>
      {results.length === 0 ? (
        <p>No open ports found in the specified range.</p>
      ) : (
        <ul>
          {results.map((port, index) => (
            <li key={index}>{port === 'Error occurred' ? port : `Port ${port} is open`}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;