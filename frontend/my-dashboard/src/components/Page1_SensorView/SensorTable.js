import React, { useEffect, useState } from 'react';

import { socket } from '../../api';

import './SensorView.css';

function SensorTable() {

    const [data, setData] = useState([]);

    // =========================================
    // SOCKET LIVE DATA
    // =========================================
    useEffect(() => {

        socket.on("sensor_update", (payload) => {

            const liveData = payload.sensorData;

            setData((prev) => [

                ...prev,

                liveData

            ]);
        });

        return () => {

            socket.off("sensor_update");

        };

    }, []);

    // =========================================
    // TABLE HEADERS
    // =========================================
    const headers = data[0]

        ? Object.keys(data[0]).filter(

            (key) =>
                key !==
                "POFRAS Score (0_36)"

        )

        : [];

    // =========================================
    // ALERT LOGIC
    // =========================================
    const hasAlert = (row) => {

        return (

            (row['Heart Rate (bpm)'] &&
                row['Heart Rate (bpm)'] < 130)

            ||

            (row['Latch/Tongue Motion (0_1)'] &&
                row['Latch/Tongue Motion (0_1)'] < 0.5)

            ||

            (row['Lip Compression Force (g)'] &&
                row['Lip Compression Force (g)'] < 30)

            ||

            (row['SpO2 (%)'] &&
                row['SpO2 (%)'] < 92)

            ||

            (row['Suction Pressure (mmHg)'] &&
                row['Suction Pressure (mmHg)'] < 60)

        );
    };

    return (

        <div className="table-container">

            <h2>
                📊 Live Sensor Dataset
            </h2>

            <table>

                <thead>

                    <tr>

                        {headers.map((key) => (

                            <th key={key}>
                                {key}
                            </th>

                        ))}

                    </tr>

                </thead>

                <tbody>

                    {data.map((row, i) => (

                        <tr

                            key={i}

                            className={
                                hasAlert(row)
                                    ? "alert-row"
                                    : ""
                            }

                            style={
                                hasAlert(row)

                                    ? {
                                        background:
                                            "linear-gradient(90deg, #ffcccc, #ff6666)"
                                    }

                                    : {}
                            }

                        >

                            {headers.map((key, j) => (

                                <td key={j}>

                                    {row[key]}

                                </td>

                            ))}

                        </tr>

                    ))}

                </tbody>

            </table>

            {data.length === 0 && (

                <p>
                    Waiting for live sensor data...
                </p>

            )}

        </div>
    );
}

export default SensorTable;
