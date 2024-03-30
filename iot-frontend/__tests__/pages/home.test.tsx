import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import Home from '../../src/pages/index'
// import fullDeviceStats from '@/public/full_device_stats.json'

describe('Page', () => {
  it('renders the Loading spinner initially', () => {
    render(<Home />)
    // const loadingSpinner = screen.getByRole('img', { name: /loading spinner/i })
    // expect(loadingSpinner).toBeInTheDocument()
  })

  // it('renders the DataTable component after data is loaded', async () => {
  //   render(<Page />)
  //   const dataTable = await waitFor(() => screen.getByRole('table'))
  //   expect(dataTable).toBeInTheDocument()
  // })

  // it('flattens nested data correctly', () => {
  //   const flattenedData = flattenNestedData(fullDeviceStats)
  //   expect(flattenedData).toHaveLength(2)
  //   expect(flattenedData[0]).toHaveProperty('client_name', 'Client A')
  //   expect(flattenedData[0]).toHaveProperty('device_id', 'Device A1')
  //   expect(flattenedData[0]).toHaveProperty('metric_temperature', 25)
  // })
})
