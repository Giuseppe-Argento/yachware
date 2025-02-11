import { useState } from 'react';
import Link from 'next/link';
import {
  UserCircleIcon,
  HomeIcon,
  CogIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon ,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Icon for Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-200 dark:bg-gray-700 p-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <XMarkIcon className="w-6 h-6 text-gray-700 dark:text-white" />
          : <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-white" />}
      </button>

      {/* Sidebar - Fixed on Desktop */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 dark:text-white shadow-lg p-4 flex flex-col transition-transform duration-300
            ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex flex-col items-center mb-6">
          <UserCircleIcon className="w-16 h-16 text-gray-700 dark:text-white mb-2" />
          <h2 className="text-lg font-semibold">John Doe</h2>
        </div>

        <nav className="flex-1 flex flex-col space-y-4">
          <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <HomeIcon className="w-5 h-5" />
            <Link href='/'><span>Dashboard</span></Link>
          </button>
          <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChartBarIcon className="w-5 h-5" />
            <a href='/analytics'><span>Analytics</span></a>
          </button>
          <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <CogIcon className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <BellIcon className="w-5 h-5" />
            <span>Notifications</span>
          </button>
        </nav>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">© 2025 YanchWare</div>
      </div>

      {/* Background overlay when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;



