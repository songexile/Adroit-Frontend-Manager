import React from 'react'
import VerticalBarChart from '../components/charts/BarChart' // Path to your VerticalBarChart component

// Define the DataItem interface
interface DataItem {
  name: string
  value: number
}

const GaugeChartPage = () => {
  const jsonData: DataItem[] = [
    { name: 'Water Soil', value: 50 },
    { name: 'Temperature Internal', value: 7 },
    { name: 'Battery Value', value: 3310 },
    { name: 'Conduct Soil', value: 0.0 },
    { name: 'Temperature Soil', value: 21.28 },
  ]

  return (
    <div>
      <h1>Gauge Chart</h1>
      <VerticalBarChart data={jsonData} />
    </div>
  )
}

export default GaugeChartPage
