import Link from 'next/link'

const Header = ({
  fetchDataAndUpdate,
  searchById,
  setSearchById,
  searchByClientName,
  setSearchByClientName,
}: // recentlyOfflineCount,
// totalDevicesOfflineCount,
HeaderProps) => {
  const handleFetchAndUpdate = async () => {
    if (fetchDataAndUpdate) {
      await fetchDataAndUpdate()
    }
  }

  return (
    <>
      {/* Top Blue Header */}
      <div className="bg-blue-800 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href={'/'} className="font-bold">
            Adroit
          </Link>
        </div>
      </div>
      <div className="bg-gray-200 py-2 px-4">
        <div className="container mx-auto md:flex items-center justify-between">
          {/* Search By ID */}
          <div className="flex items-center space-x-2">
            {setSearchById && (
              <input
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                type="text"
                placeholder="Search by Device ID"
                value={searchById}
                onChange={(e) => setSearchById(e.target.value)}
              />
            )}
          </div>
          {/* Search By ClientName */}
          <div className="flex items-center space-x-2 mt-3 md:mt-0">
            {setSearchByClientName && (
              <input
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                type="text"
                placeholder="Search by Client Name"
                value={searchByClientName}
                onChange={(e) => setSearchByClientName(e.target.value)}
              />
            )}
          </div>
          {/* Fetch New Data Button */}
          <div className="flex items-center space-x-2 mt-3 md:mt-0">
            {fetchDataAndUpdate && (
              <button
                onClick={handleFetchAndUpdate}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
              >
                Fetch New Data
              </button>
            )}
            {/* {recentlyOfflineCount !== undefined && totalDevicesOfflineCount !== undefined && (
              <span className="text-sm text-gray-600">
                Recently Offline (within 48 hours): {recentlyOfflineCount} | Total Devices Offline:{' '}
                {totalDevicesOfflineCount} | Clients Offline:{' '}
                {totalDevicesOfflineCount - recentlyOfflineCount}
              </span>
            )} */}
          </div>
        </div>
      </div>
      <span className="text-sm text-gray-600 flex justify-center">
        Recently Offline (within 48 hours): 2 | Total Devices Offline: 450 | Clients Offline: 400
      </span>
    </>
  )
}

export default Header
