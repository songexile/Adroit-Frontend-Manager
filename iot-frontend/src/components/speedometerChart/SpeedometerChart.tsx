import React, { useEffect, useRef } from 'react'
import { Chart, ChartConfiguration, registerables } from 'chart.js'

Chart.register(...registerables)

interface GaugeProps {
  value: number
  colors: string[]
}

const SpeedometerChart: React.FC<GaugeProps> = ({ value, colors }) => {
  const chartContainer = useRef<HTMLCanvasElement | null>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartContainer.current) {
      const config: ChartConfiguration = {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: [value, 20 - value],
              backgroundColor: colors,
              hoverBackgroundColor: colors,
              borderWidth: 0,
            },
          ],
        },

        options: {
          circumference: 180,
          rotation: 270,
          cutoutPercentage: 80, // This is for the thickness of the gauge
          tooltips: { enabled: false },
          hover: { mode: null },
          responsive: false,
        },
      }

      chartInstance.current = new Chart(chartContainer.current, config)
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
        chartInstance.current = null
      }
    }
  }, [value, colors])

  return (
    <div className="mx-8">
      <canvas className="w-full h-32 " ref={chartContainer} />
    </div>
  )
}

export default SpeedometerChart
