import React, { useState } from 'react';
import SpeedometerChart from '../components/speedometerChart/SpeedometerChart';

const SpeedometerPage = () => {
  const [value, setValue] = useState(0.32);

  return (
    <div>
      <h1>Speedometer Chart</h1>

      <SpeedometerChart value={value} colors={['#00ff00', '#ff0000']} />
    </div>
  );
};

export default SpeedometerPage;