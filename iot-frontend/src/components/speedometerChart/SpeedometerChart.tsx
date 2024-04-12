import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

interface GaugeProps {
  value: number;
  colors: string[];
}

const SpeedometerChart: React.FC<GaugeProps> = ({ value, colors }) => {
  const chartContainer = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartContainer.current) {
      const config: ChartConfiguration = {
        type: 'doughnut',
        data: {
          labels: ['Value', 'Remaining'],
          datasets: [
            {
              data: [value, 100 - value],
              backgroundColor: colors,
              hoverBackgroundColor: colors
            }
          ]
        },
        options: {
          circumference: Math.PI,
          rotation: Math.PI,
          cutoutPercentage: 80, // This is for the thickness of the gauge
          tooltips: { enabled: false },
          //         hover: { mode: null },
          responsive: false,
        }
      };

      chartInstance.current = new Chart(chartContainer.current, config);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [value, colors]);

  return <canvas ref={chartContainer} />;
};

export default SpeedometerChart;