import Image from 'next/image';
import Link from 'next/link';
import { CustomUser, HeaderProps } from '@/types';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import LoginScreen from '@/pages/login';
import { Switch } from '@/components/ui/switch';
import { useAtom } from 'jotai';
import { hideSelectedAtom } from './context/toggleAtom';
import AdroitLogo from '@/public/assets/img/Adroit-environmental-monitoring2.png';
import { capitalizeWords } from '@/utils';

const Header = ({
  fetchDataAndUpdate,
  searchByClientName,
  setSearchByClientName,
  searchByDeviceKey,
  setSearchByDeviceKey,
  totalDevicesOfflineCount,
  clientsOfflineCount,
}: // recentlyOfflineCount,
HeaderProps) => {
  const handleFetchAndUpdate = async () => {
    if (fetchDataAndUpdate) {
      await fetchDataAndUpdate();
    }
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hideSelected, setHideSelected] = useAtom(hideSelectedAtom);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();

  if (!session || !session.user) {
    return <LoginScreen />;
  }

  const { username } = session.user as CustomUser;
  const { email } = session.user as CustomUser;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    await signOut();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <>
      {/* Top Blue Header */}
      <div className="bg-gradient-to-b from-cyan-500 to-blue-500 text-white">
        <div className="container mx-auto flex p-6 justify-between items-center">
          <Link
            href={'/'}
            className="font-bold flex items-center justify-center gap-x-4"
          >
            <Image
              alt="Logo of Spark x Adroit"
              src={AdroitLogo}
              width={200}
              height={200}
              style={{ width: '120px', height: 'auto' }}
              priority={true}
            />

            <div className="font-thin text-sm mt-[1.3rem]">
              <h1 className="">Frontend </h1>
              <h1>Manager</h1>
            </div>
          </Link>
          {/* Dropdown Profile Menu */}
          <div
            className="relative"
            ref={dropdownRef}
          >
            <button
              className="flex items-center space-x-2"
              onClick={toggleDropdown}
            >
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
              <span className="font-medium hidden sm:inline">
                {capitalizeWords(username ?? '')}
              </span>
            </button>
            {isDropdownOpen && (
              <div className="z-50 absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow">
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900">
                    {capitalizeWords(username ?? '')}
                  </span>
                  <span className="block text-sm text-gray-500 truncate">{email}</span>
                </div>
                <ul
                  className="py-2"
                  aria-labelledby="user-menu-button"
                >
                  <li>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile Settings
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {(setSearchByClientName || setSearchByDeviceKey || fetchDataAndUpdate) && (
          <div className="h-full bg-cyan-900 p-6">
            <div
              className={`${setSearchByClientName && setSearchByDeviceKey ? '   py-2 px-4' : ''}`}
            >
              <div className="container mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  {(setSearchByClientName || setSearchByDeviceKey) && (
                    <div className="flex flex-col gap-y-4 sm:flex-row sm:gap-x-8 w-full md:w-auto">
                      {setSearchByClientName && (
                        <input
                          className="border-b-4 rounded-2xl border-gray-100 text-black font-bold py-2 px-4 focus:ring-cyan-300 transition w-full md:w-auto"
                          type="text"
                          placeholder="Search by Client Name"
                          value={searchByClientName}
                          onChange={(e) => setSearchByClientName(e.target.value)}
                        />
                      )}
                      {setSearchByDeviceKey && (
                        <input
                          className="border-b-4 rounded-2xl border-gray-100 text-black font-bold py-2 px-4 focus:ring-cyan-300 transition w-full md:w-auto"
                          type="text"
                          placeholder="Search by Device Key"
                          value={searchByDeviceKey}
                          onChange={(e) => setSearchByDeviceKey(e.target.value)}
                        />
                      )}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                    {fetchDataAndUpdate && (
                      <button
                        onClick={handleFetchAndUpdate}
                        className="focus:outline-none text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 hover:shadow-md transition w-full sm:w-auto"
                      >
                        Fetch New Data
                      </button>
                    )}
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <Switch
                        checked={hideSelected}
                        onCheckedChange={setHideSelected}
                        id="airplane-mode"
                      />
                      <label htmlFor="airplane-mode">Hide Null Values</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Info */}
      {totalDevicesOfflineCount && (
        <div className=" gap-x-4 text-md text-center py-4 text-gray-600 mx-auto flex items-center justify-center">
          Devices Offline
          <span className="font-bold p-1 bg-gray-100 border-2 border-bg-cyan-900  hover:text-black transition ">
            {totalDevicesOfflineCount}
          </span>
          Clients Offline
          <span className="font-bold p-1 bg-gray-100 border-2 border-bg-cyan-900 hover:text-black transition">
            {clientsOfflineCount}
          </span>
        </div>
      )}
    </>
  );
};

export default Header;
