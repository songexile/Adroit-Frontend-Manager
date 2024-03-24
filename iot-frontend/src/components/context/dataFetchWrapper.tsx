import React, { createContext, useState } from 'react'

const DataContext = createContext({})

const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [data] = useState('hi')

  //   useEffect(() => {
  //     // Optional data fetching logic (replace with your actual implementation)
  //     const fetchData = async () => {
  //       try {
  //         const response = await fetch('/your-api-endpoint')
  //         const fetchedData = await response.json()
  //         setData(fetchedData)
  //       } catch (error) {
  //         console.error('Error fetching data:', error)
  //       }
  //     }

  //     fetchData()
  //   }, [])

  return <DataContext.Provider value={{ data }}>{children}</DataContext.Provider>
}

export default DataProvider
