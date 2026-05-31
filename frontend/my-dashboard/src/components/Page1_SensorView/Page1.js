import React from 'react';
import Header from '../Header';
import SensorView from './SensorView';
import SensorTable from './SensorTable';
import ParameterChart from './ParameterChart';
import './Page1.css';

function Page1() {
  return (
    <div className="page1-container">
      <Header />
      <main className="page1-content-layout">
        <div className="telemetry-top-row">
          <SensorView />
          <ParameterChart />
        </div>
        <div className="telemetry-bottom-row">
          <SensorTable />
        </div>
      </main>
    </div>
  );
}

export default Page1;
