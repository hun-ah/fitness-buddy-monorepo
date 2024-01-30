/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Card, Toast } from 'flowbite-react';
import Calendar from '@/components/dashboard/appointments/Calendar';
import { HiCheck } from 'react-icons/hi2';

const Appointments = ({ fetchAppointmentsByDate }) => {
  const [saved, setSaved] = useState(false);

  return (
    <section className='flex-1 sm:ml-64'>
      {saved && (
        <Toast className='fixed top-2 right-2 z-10'>
          <div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200'>
            <HiCheck className='h-5 w-5' />
          </div>
          <div className='ml-3 text-sm font-normal'>
            Appointment added successfully.
          </div>
          <Toast.Toggle onClick={() => setSaved(false)} />
        </Toast>
      )}
      <div className='p-4 h-full bg-gray-100 sm:mt-0 mt-[70px]'>
        <Card className='h-fit card max-w-[1300px]'>
          <div>
            <h1 className='text-4xl font-bold text-gray-900'>Appointments</h1>
          </div>
          <Calendar
            setSaved={setSaved}
            fetchAppointmentsByDate={fetchAppointmentsByDate}
          />
        </Card>
      </div>
    </section>
  );
};

export default Appointments;
