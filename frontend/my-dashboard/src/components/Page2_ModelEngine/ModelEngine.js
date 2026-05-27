import React, { useEffect, useState } from 'react';
import PredictionPanel from './PredictionPanel';
import axios from 'axios';

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
    <div>
      <h2>📊 Feeding Readiness Predictions</h2>
      {results.length > 0 ? (
        results.map((chunk, index) => (
          <PredictionPanel key={index} result={chunk} />
        ))
      ) : (
        <p>Loading predictions...</p>
      )}
    </div>
  );
}

export default ModelEngine;