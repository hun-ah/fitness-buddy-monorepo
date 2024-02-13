/* eslint-disable react/prop-types */
import dayjs from 'dayjs';
import { Card } from 'flowbite-react';
import {
  HiOutlineUsers,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
} from 'react-icons/hi';
import { useAppContext as UserContext } from '@/components/contexts/UserContext';
import { useAppContext as AppointmentContext } from '@/components/contexts/AppointmentContext';
import { useAppContext as ClientContext } from '@/components/contexts/ClientContext';
import Appointment from '@/components/dashboard/appointments/Appointment';
import SkeletonCard from '@/components/dashboard/appointments/SkeletonCard';
import StatCard from '@/components/dashboard/home/StatCard';
import StatLoader from '@/components/dashboard/home/StatLoader';

const AdminHome = ({ isLoading, sessionsCompleted }) => {
  const { user } = UserContext();
  const { clients } = ClientContext();
  const { appointments } = AppointmentContext();

  const today = dayjs().format('YYYY-MM-DD');

  const currentMillis = dayjs().valueOf();

  const upcomingAppointments = appointments[today]
    ? appointments[today].filter(
        (appointment) =>
          !appointment.lateCancel &&
          Number(appointment.appointmentStart) > currentMillis
      ).length
    : 0;

  const activeClients =
    clients && clients.filter((client) => client.active === true);

  const stats = [
    {
      icon: <HiOutlineUsers className='text-gray-500' />,
      title: 'Active clients',
      value: activeClients.length,
    },
    {
      icon: <HiOutlineCalendar className='text-gray-500' />,
      title: 'Upcoming appointments',
      value: upcomingAppointments,
    },
    {
      icon: <HiOutlineCheckCircle className='text-gray-500' />,
      title: 'Completed sessions this month',
      value: sessionsCompleted ? sessionsCompleted : 0,
    },
  ];

  return (
    <section className='flex-1 sm:ml-64'>
      <div className='p-4 h-full bg-gray-100 sm:mt-0 mt-[70px]'>
        <Card className='h-fit card max-w-[1300px]'>
          <div>
            {!user && isLoading ? (
              <div role='status' className='max-w-sm animate-pulse'>
                <div className='h-10 bg-gray-200 rounded-[4px] dark:bg-gray-700 w-80 mb-4'></div>
                <span className='sr-only'>Loading...</span>
              </div>
            ) : (
              <h1 className='text-4xl font-bold text-gray-900'>
                Welcome, {user.firstName}
              </h1>
            )}
          </div>
          <div className='flex gap-12 flex-col'>
            <ul className='flex flex-col gap-4 lg:flex-row'>
              {isLoading ? (
                <>
                  <StatLoader />
                  <StatLoader />
                  <StatLoader />
                </>
              ) : (
                stats.map((stat) => <StatCard key={stat.title} stat={stat} />)
              )}
            </ul>
            <div className='flex flex-col gap-4'>
              <h2 className='font-semibold text-lg'>
                Today&apos;s appointments
              </h2>
              <ul className='flex flex-col gap-2'>
                {!appointments && isLoading ? (
                  <>
                    <SkeletonCard />
                    <SkeletonCard />
                  </>
                ) : appointments[today] && clients ? (
                  appointments[today]
                    .map((appointment) => {
                      const targetClient = clients.find(
                        (client) => client._id === appointment.clientId
                      );

                      return {
                        appointment,
                        targetClient,
                      };
                    })
                    .sort(
                      (a, b) =>
                        Number(a.appointment.appointmentStart) -
                        Number(b.appointment.appointmentStart)
                    )
                    .map(({ appointment, targetClient }) => (
                      <Appointment
                        key={appointment._id}
                        appointment={appointment}
                        client={targetClient}
                      />
                    ))
                ) : (
                  <span className='text-gray-500 text-sm block'>
                    No appointments to show
                  </span>
                )}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AdminHome;
