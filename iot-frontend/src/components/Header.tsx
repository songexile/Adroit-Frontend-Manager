import Image from 'next/image'
import Link from 'next/link'
import sparkAdroit from '@/public/assets/img/Adroit-environmental-monitoring2.png'

const Header = ({
  fetchDataAndUpdate,
  searchById,
  setSearchById,
  searchByClientName,
  setSearchByClientName,
  totalDevicesOfflineCount,
  clientsOfflineCount,
}: // recentlyOfflineCount,
HeaderProps) => {
  const handleFetchAndUpdate = async () => {
    if (fetchDataAndUpdate) {
      await fetchDataAndUpdate()
    }
  }

  return (
    <>
      {/* Top Blue Header */}
      <div className="bg-gradient-to-b from-cyan-500 to-blue-500  text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href={'/'} className="font-bold">
            <Image
              alt="Logo of Spark x Adroit"
              src={sparkAdroit}
              width={0}
              height={0}
              style={{ width: '120px', height: 'auto' }}
              priority={true}
            />
            <h1 className="font-thin text-sm">Frontend Manager</h1>
          </Link>
        </div>
      </div>
      <div className={`${setSearchById && setSearchByClientName ? 'bg-gray-200 py-2 px-4' : ''}`}>
        <div className="container mx-auto md:flex items-center justify-between">
          {/* Search By ID and Client Name */}
          <div className="flex items-center gap-x-8 ">
            {setSearchById && (
              <input
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                type="text"
                placeholder="Search by Device ID"
                value={searchById}
                onChange={(e) => setSearchById(e.target.value)}
              />
            )}
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
          <div className="flex items-center space-x-2">
            {fetchDataAndUpdate && (
              <button
                onClick={handleFetchAndUpdate}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
              >
                Fetch New Data
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Info */}
      {totalDevicesOfflineCount && (
        <span className="text-md text-center py-4  text-gray-600 mx-auto flex items-center justify-center">
          Recently Offline (within 48 hours): 2 | Total Devices Offline: {totalDevicesOfflineCount}{' '}
          | Clients Offline: {clientsOfflineCount}
        </span>
      )}
    </>
  )
}

export default Header
