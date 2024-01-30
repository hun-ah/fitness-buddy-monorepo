import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAppContext as UserContext } from '@/components/contexts/UserContext';
import { useAppContext as ClientContext } from '@/components/contexts/ClientContext';
import { useAppContext as IsLoading } from '@/components/contexts/IsLoadingContext';
import { useAppContext as AppointmentContext } from '@/components/contexts/AppointmentContext';
import AdminNavbar from '@/components/dashboard/Sidebar';
import AdminHome from './dashboard/home/AdminHome';
import Clients from './dashboard/clients/Clients';
import Appointments from './dashboard/appointments/Appointments';
import Profile from './dashboard/profile/Profile';
import ClientProfile from './dashboard/clients/ClientProfile';
import NotFoundDashboard from './NotFoundDashboard';
import apiUrl from '@/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [overlay, setOverlay] = useState('visible');
  const {
    appointments,
    setAppointments,
    setDaysWithAppointments,
    sessionsCompleted,
    setSessionsCompleted,
    clearAppointments,
  } = AppointmentContext();
  const { setUser, clearUser } = UserContext();
  const { setClients, clearClients } = ClientContext();
  const { isLoading, stopLoading } = IsLoading();

  // Prevent scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = overlay;

    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [overlay]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setOverlay((prevOverflow) =>
      prevOverflow === 'hidden' ? 'visible' : 'hidden'
    );
  };

  const clearUserInfo = () => {
    clearClients();
    clearUser();
    clearAppointments();
  };

  const deleteCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    console.log('cookie deleted');
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${apiUrl}/dashboard`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await res.json();
        console.log(data);

        if (res.status === 200) {
          const firstName = data.user.firstName.split(' ')[0];
          const lastName = data.user.lastName
            .toLowerCase()
            .split(/[-\s]/)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join('-');
          const email = data.user.email;
          const phone = data.user.phone;
          const avatar = data.user.avatar;

          setUser({
            firstName:
              firstName.split('')[0].toUpperCase() + firstName.slice(1),
            lastName: lastName,
            email: email,
            phone: phone,
            avatar: avatar,
          });
        } else if (res.status === 401) {
          clearUserInfo();
          deleteCookie('loggedIn');
          navigate('/login');
        }
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, setUser]);

  useEffect(() => {
    const getClients = async () => {
      try {
        const res = await fetch(`${apiUrl}/dashboard/clients`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await res.json();

        if (res.status === 200) {
          setClients(data.clients);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getClients();
  }, [setClients]);

  useEffect(() => {
    const getDaysWithAppointments = async () => {
      try {
        const res = await fetch(`${apiUrl}/dashboard/appointments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const data = await res.json();

        // Generate unique list of dates (remove repeats using Set)
        const appointmentDates = [
          ...new Set(
            data.appointments.map((appointment) => appointment.appointmentDate)
          ),
        ];

        setDaysWithAppointments(appointmentDates);
      } catch (err) {
        console.log(err);
      }
    };
    getDaysWithAppointments();
  }, [setDaysWithAppointments]);

  const fetchAppointmentsByDate = async (date) => {
    try {
      const res = await fetch(
        `${apiUrl}/dashboard/appointments/${date.format('YYYY-MM-DD')}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      const data = await res.json();
      return data.appointments;
    } catch (err) {
      console.log(err);
    }
  };

  // Get appointments on current date
  useEffect(() => {
    const currentDate = dayjs();
    const getAppointments = async () => {
      try {
        let appointments = await fetchAppointmentsByDate(currentDate);

        if (appointments.length === 0) {
          appointments = {};
          setAppointments(appointments);
        } else {
          const existingAppointments =
            JSON.parse(localStorage.getItem('appointments')) || {};

          const updatedAppointments = {
            ...existingAppointments,
            [currentDate.format('YYYY-MM-DD')]: appointments,
          };
          setAppointments(updatedAppointments);
        }
      } catch (err) {
        console.log(err);
      } finally {
        stopLoading();
      }
    };
    getAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAppointments]);

  const today = dayjs().format('YYYY-MM-DD');
  useEffect(() => {
    const getCheckedInCount = async () => {
      const currentMonth = today.split('-').slice(0, 2).join('-');
      try {
        const res = await fetch(
          `${apiUrl}/dashboard/checkedInAppointments/${currentMonth}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );
        const data = await res.json();

        localStorage.setItem(
          'sessionsCompleted',
          JSON.stringify(data.appointments.length)
        );
        setSessionsCompleted(data.appointments.length);
      } catch (err) {
        console.log(err);
      }
    };
    getCheckedInCount();
  }, [today, appointments, setSessionsCompleted]);

  return (
    <div
      className='flex flex-col h-screen'
      onClick={() => {
        setMenuOpen(false);
        menuOpen &&
          setOverlay((prevOverflow) =>
            prevOverflow === 'hidden' ? 'visible' : 'hidden'
          );
      }}
    >
      <div
        className={`top-0 right-0 left-[256px] h-screen w-calc(100vw - 256px) absolute bg-gray-900  bg-opacity-50 ${
          menuOpen ? 'opacity-100 duration-500 z-50' : 'opacity-0 -z-50'
        }`}
      ></div>
      <AdminNavbar toggleMenu={toggleMenu} menuOpen={menuOpen} />
      <Routes>
        <Route path='/*' element={<NotFoundDashboard />} />
        <Route
          path='/home'
          element={
            <AdminHome
              isLoading={isLoading}
              sessionsCompleted={sessionsCompleted}
            />
          }
        />
        <Route path='/clients' element={<Clients />} />
        <Route path='/clients/:clientId' element={<ClientProfile />} />
        <Route
          path='/appointments'
          element={
            <Appointments fetchAppointmentsByDate={fetchAppointmentsByDate} />
          }
        />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
