/* eslint-disable react/prop-types */
import apiUrl from '@/api';
import Logo from '@/assets/logo.svg?react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext as AppointmentContext } from '@/components/contexts/AppointmentContext';
import { useAppContext as ClientContext } from '@/components/contexts/ClientContext';
import { useAppContext as UserContext } from '@/components/contexts/UserContext';
import {
  HiOutlineCalendar,
  HiOutlineChartPie,
  HiOutlineLogout,
  HiMenu,
  HiOutlineUsers,
  HiOutlineUserCircle,
} from 'react-icons/hi';

const AdminNavbar = ({ menuOpen, toggleMenu }) => {
  const { clearAppointments } = AppointmentContext();
  const { clearClients } = ClientContext();
  const { clearUser } = UserContext();
  const navigate = useNavigate();

  const deleteCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${apiUrl}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await res.json();
      console.log(data);

      if (res.status === 200) {
        clearUser();
        clearClients();
        clearAppointments();
        navigate('/login');
        deleteCookie('loggedIn');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div
        className={`${
          menuOpen ? 'w-64' : ''
        } border-b-[1px] fixed w-full h-[70px] bg-white z-10 sm:hidden`}
      >
        <button
          data-drawer-target='default-sidebar'
          data-drawer-toggle='default-sidebar'
          aria-controls='default-sidebar'
          type='button'
          className='inline-flex items-center p-2 m-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
          onClick={toggleMenu}
        >
          <HiMenu size={30} />
        </button>
      </div>
      <aside
        id='default-sidebar'
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
        aria-label='Sidenav'
      >
        <div className='overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800 border-r-[1px]'>
          <div className='border-b-[1px] pb-[20px] mb-[20px]'>
            <Logo height={33} width={200} />
          </div>
          <ul className='flex flex-col justify-between'>
            <div className='space-y-2'>
              <li>
                <NavLink
                  to={{ pathname: '/dashboard/home' }}
                  className='flex items-center py-2 pl-2 gap-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                  onClick={menuOpen && toggleMenu}
                >
                  <HiOutlineChartPie size={16} className='mx-1 text-gray-500' />
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={{ pathname: '/dashboard/clients' }}
                  className='flex items-center py-2 pl-2 gap-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                  onClick={menuOpen && toggleMenu}
                >
                  <HiOutlineUsers size={16} className='mx-1 text-gray-500' />
                  <span>Clients</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={{ pathname: '/dashboard/appointments' }}
                  className='flex items-center py-2 pl-2 gap-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                  onClick={menuOpen && toggleMenu}
                >
                  <HiOutlineCalendar size={16} className='mx-1 text-gray-500' />
                  <span>Appointments</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={{ pathname: '/dashboard/profile' }}
                  className='flex items-center py-2 pl-2 gap-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                  onClick={menuOpen && toggleMenu}
                >
                  <HiOutlineUserCircle
                    size={16}
                    className='mx-1 text-gray-500'
                  />
                  <span>Profile</span>
                </NavLink>
              </li>
              <li className='cursor-pointer' onClick={handleLogout}>
                <form className='flex items-center py-2 pl-2 gap-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                  <HiOutlineLogout size={16} className='mx-1 text-gray-500' />
                  <span>Sign out</span>
                </form>
              </li>
            </div>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default AdminNavbar;
