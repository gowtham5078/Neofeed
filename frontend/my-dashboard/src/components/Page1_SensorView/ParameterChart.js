import React, { useEffect, useState } from "react";

import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { socket } from "../../api";

import "./SensorView.css";

// ======================================
// REGISTER CHART COMPONENTS
// ======================================
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ParameterChart() {

  // ======================================
  // STATES
  // ======================================
  const [data, setData] = useState([]);

  const [selected, setSelected] =
    useState("Heart Rate (bpm)");

  // ======================================
  // SOCKET LIVE DATA
  // ======================================
  useEffect(() => {

    socket.on("sensor_update", (payload) => {

      console.log("📈 Chart Update:", payload);

      const liveData = payload.sensorData;

      setData((prevData) => [
        ...prevData,
        liveData
      ]);

    });

    // CLEANUP
    return () => {

      socket.off("sensor_update");

    };

  }, []);

  // ======================================
  // CHART DATA
  // ======================================
  const chartData = {

    labels: data.map(
      (_, i) => `T${i + 1}`
    ),

    datasets: [
      {
        label: selected,

        data: data.map(
          (d) => d[selected]
        ),

        borderColor: "#00796b",

        backgroundColor:
          "rgba(0,121,107,0.2)",

        fill: true,

        tension: 0.3,
      },
    ],
  };

  // ======================================
  // RENDER
  // ======================================
  return (

    <div className="chart-container">

      <h2>
        📈 Real-Time Parameter Trend
      </h2>

      {/* PARAMETER DROPDOWN */}
      <select
        value={selected}
        onChange={(e) =>
          setSelected(e.target.value)
        }
      >

        {data.length > 0 &&

          Object.keys(data[0])

            .filter(
              (key) =>
                key !==
                "POFRAS Score (0_36)"
            )

            .map((key) => (

              <option
                key={key}
                value={key}
              >

                {key}

              </option>

            ))
        }

      </select>

      {/* LIVE CHART */}
      <Line data={chartData} />

    </div>
  );
}

export default ParameterChart;
