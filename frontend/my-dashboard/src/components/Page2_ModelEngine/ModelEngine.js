import React, { useEffect, useState } from 'react';
import Header from '../Header';
import PredictionPanel from './PredictionPanel';
import axios from 'axios';
import './PredictionPanel.css';

function ModelEngine() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/process-dataset');
        setResults(res.data);
      } catch (err) {
        console.error('Error fetching dataset predictions:', err);
      }
    };

    fetchPredictions();
  }, []);

  return (
    <div className="model-engine-page">
      <Header />
      
      <main className="model-engine-content">
        <div className="engine-header-row">
          <div>
            <h1 className="engine-title">🧠 AI Predictive Analysis Engine</h1>
            <p className="engine-subtitle">Feed-readiness diagnostics powered by Deep Learning</p>
          </div>
          <div className="engine-status-tag">
            <span className="engine-status-dot"></span>
            <span>MODEL_ENGINE_ONLINE</span>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="predictions-deck">
            {results.map((chunk, index) => (
              <PredictionPanel key={index} result={chunk} />
            ))}
          </div>
        ) : (
          <div className="prediction-loading-container">
            <div className="prediction-spinner"></div>
            <p>Processing patient cardiopulmonary telemetry logs & extracting predictive metrics...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default ModelEngine;