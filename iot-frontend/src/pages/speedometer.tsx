import React, { useState } from 'react';
import SpeedometerChart from '../components/speedometerChart/SpeedometerChart';

const SpeedometerPage = () => {
  const [value, setValue] = useState(75);

  return (
    <div>
      <h1>Speedometer Chart</h1>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
      />
      <SpeedometerChart value={value} colors={['#ff0000', '#00ff00']} />
    </div>
  );
};

export default SpeedometerPage;