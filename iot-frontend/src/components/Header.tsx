import Link from 'next/link'
import React from 'react'

const Header = ({ fetchDataAndUpdate }: { fetchDataAndUpdate?: () => Promise<void> }) => {
  const handleFetchAndUpdate = async () => {
    if (fetchDataAndUpdate !== undefined) {
      await fetchDataAndUpdate()
    }
  }

  return (
    <main>
      <>
        {/* Top Blue Header */}
        <div className="bg-blue-800 text-white py-2 px-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href={'/'} className="font-bold">
              Adroit
            </Link>
          </div>
        </div>

        {/* Light Grey Header */}
        <div className="bg-gray-200 py-2 px-4">
          <div className="container mx-auto md:flex items-center justify-between">
            {/* Search By ID */}
            <div className="flex items-center space-x-2">
              <input
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                type="text"
                placeholder="Search by ID"
                //  value={searchById}
                //  onChange={(e) => setSearchById(e.target.value)}
              />
            </div>

            {/* Search By Location */}
            <div className="flex items-center space-x-2 mt-3 md:mt-0">
              <input
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                type="text"
                placeholder="Search by Location"
                //   value={searchByLocation}
                //  onChange={(e) => setSearchByLocation(e.target.value)}
              />
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none">
                Search
              </button>
            </div>

            <button
              onClick={handleFetchAndUpdate}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Fetch New Data
            </button>
          </div>
        </div>
      </>
    </main>
  )
}

export default Header
