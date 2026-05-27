import React from 'react';
import SensorView from './SensorView';
import SensorTable from './SensorTable';
import ParameterChart from './ParameterChart';
import './Page1.css';
import backgroundImg from '../../assets/images/theme3.png'; // import image

function Page1() {
  return (
    <div
      className="page1-container"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <SensorView />
      <ParameterChart />
      <SensorTable />
    </div>
  );
}

export default Page1;
