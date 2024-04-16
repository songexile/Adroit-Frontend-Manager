import Image from 'next/image'
import Link from 'next/link'
import { CustomUser, HeaderProps } from '@/types'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import LoginScreen from '@/pages/login'

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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: session } = useSession()

  if (!session || !session.user) {
    return <LoginScreen />
  }
  const { given_name } = session.user as CustomUser

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleLogout = async () => {
    await signOut()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside, true)

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  return (
    <>
      {/* Top Blue Header */}
      <div className="bg-gradient-to-b  from-cyan-500 to-blue-500 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href={'/'} className="font-bold flex items-center justify-center gap-x-4">
            <Image
              alt="Logo of Spark x Adroit"
              src="/assets/img/Adroit-environmental-monitoring2.png"
              width={200}
              height={200}
              style={{ width: '120px', height: 'auto' }}
              priority={true}
            />
            <h1 className="font-thin text-sm">Frontend Manager</h1>
          </Link>
          <div className="relative" ref={dropdownRef}>
            <button className="flex items-center space-x-2" onClick={toggleDropdown}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">{given_name}</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                <div className="py-1">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {(setSearchById || setSearchByClientName || fetchDataAndUpdate) && (
          <div className={`${setSearchById && setSearchByClientName ? '   py-2 px-4' : ''}`}>
            <div className="container mx-auto md:flex items-center justify-between">
              {(setSearchById || setSearchByClientName) && (
                <div className="flex flex-col gap-y-4 sm:flex-row sm:gap-x-8">
                  {setSearchById && (
                    <input
                      className="border-b-4 border-gray-100  text-black font-bold py-2 px-4     focus:ring-blue-500 transition focus:border-blue-500"
                      type="text"
                      placeholder="Search by Device ID"
                      value={searchById}
                      onChange={(e) => setSearchById(e.target.value)}
                    />
                  )}
                  {setSearchByClientName && (
                    <input
                      className="    border-b-4 border-gray-100  text-black font-bold py-2 px-4     focus:ring-blue-500 transition focus:border-blue-500"
                      type="text"
                      placeholder="Search by Client Name"
                      value={searchByClientName}
                      onChange={(e) => setSearchByClientName(e.target.value)}
                    />
                  )}
                </div>
              )}
              {fetchDataAndUpdate && (
                <div className="flex items-center space-x-2 mt-3 md:mt-0">
                  <button
                    onClick={handleFetchAndUpdate}
                    className=" bg-white border-b-4 border-gray-100 text-gray-400   font-bold py-2 px-4     focus:ring-blue-500 transition focus:border-blue-500"
                  >
                    Fetch New Data
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Info */}
      {totalDevicesOfflineCount && (
        <span className="text-md text-center py-4 text-gray-600 mx-auto flex items-center justify-center">
          Recently Offline (within 48 hours): 2 | Total Devices Offline: {totalDevicesOfflineCount}{' '}
          | Clients Offline: {clientsOfflineCount}
        </span>
      )}
    </>
  )
}

export default Header
