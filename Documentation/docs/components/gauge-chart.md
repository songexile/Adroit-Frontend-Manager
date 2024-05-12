# Gauge Chart
<h2>SpeedometerChart Component</h2>

The SpeedometerChart component is a React functional component used to display a speedometer-like gauge chart using Chart.js. This component accepts two props:

value: a number representing the value to be displayed on the gauge.

colors: an array of strings representing the colors to be used for the gauge segments.

<h3>Usage:</h3>

To use the SpeedometerChart component, import it into your React component and pass the required props:
```ts
import React from 'react';
import SpeedometerChart from './SpeedometerChart';

const MyComponent = () => {
  const gaugeValue = 75;
  const gaugeColors = ['#ff0000', '#00ff00'];

  return (
    <div>
      <SpeedometerChart value={gaugeValue} colors={gaugeColors} />
    </div>
  );
};

export default MyComponent;

```
<h3>Props:</h3>

value (number, required): The value to be displayed on the gauge.
colors (string[], required): An array of colors to be used for the gauge segments.
<h3>Example:</h3>

Here's an example of how the SpeedometerChart component can be used:
```ts
<SpeedometerChart value={75} colors={['#ff0000', '#00ff00']} />

```
<h3>Notes:</h3>

The gauge chart is based on the doughnut chart type from Chart.js.

The chart is responsive and will adjust its size based on the container element.


