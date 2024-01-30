/* eslint-disable react/prop-types */
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import { HiOutlinePlus } from 'react-icons/hi2';
import { generateDate, months, cn } from '@/helpers/calendar';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
import AddAppointment from './AddAppointment';
import { useAppContext as AppointmentContext } from '@/components/contexts/AppointmentContext';
import { useAppContext as IsLoading } from '@/components/contexts/IsLoadingContext';
import Appointments from './Appointments';

const Calendar = ({ setSaved, fetchAppointmentsByDate }) => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const currentDate = dayjs();
  const [isOpen, setOpen] = useState(false);
  const [today, setToday] = useState(currentDate);
  const [selectDate, setSelectDate] = useState(currentDate);
  const { appointments, setAppointments, daysWithAppointments } =
    AppointmentContext();
  const { startLoading, stopLoading } = IsLoading();

  // Get appointments on selected date
  useEffect(() => {
    const getAppointments = async () => {
      try {
        let newAppointments = await fetchAppointmentsByDate(selectDate);

        if (newAppointments.length !== 0) {
          const existingAppointments =
            JSON.parse(localStorage.getItem('appointments')) || {};

          const updatedAppointments = {
            ...existingAppointments,
            [selectDate.format('YYYY-MM-DD')]: newAppointments,
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
  }, [selectDate]);

  return (
    <div className='flex gap-10 xl:divide-x xl:flex-row flex-col'>
      <AddAppointment
        setOpen={setOpen}
        isOpen={isOpen}
        selectDate={selectDate}
        setSaved={setSaved}
      />
      <div>
        <div className='flex justify-between items-center'>
          <h1 className='select-none font-semibold'>
            {months[today.month()]}, {today.year()}
          </h1>
          <div className='flex gap-10 items-center '>
            <GrFormPrevious
              className='w-5 h-5 cursor-pointer hover:scale-105 transition-all'
              onClick={() => {
                setToday(today.month(today.month() - 1));
              }}
            />
            <h1
              className=' cursor-pointer hover:scale-105 transition-all'
              onClick={() => {
                setToday(currentDate);
              }}
            >
              Today
            </h1>
            <GrFormNext
              className='w-5 h-5 cursor-pointer hover:scale-105 transition-all'
              onClick={() => {
                setToday(today.month(today.month() + 1));
              }}
            />
          </div>
        </div>
        <div className='grid grid-cols-7 '>
          {days.map((day, index) => {
            return (
              <h1
                key={index}
                className='text-sm text-center h-14 w-14 grid place-content-center text-gray-500 select-none'
              >
                {day}
              </h1>
            );
          })}
        </div>

        <div className='grid grid-cols-7'>
          {generateDate(today.month(), today.year()).map(
            ({ date, currentMonth, today }, index) => {
              const hasAppointment = daysWithAppointments.includes(
                date.format('YYYY-MM-DD')
              );

              const hasAppointments = Object.prototype.hasOwnProperty.call(
                appointments,
                date.format('YYYY-MM-DD')
              );

              return (
                <div
                  key={index}
                  className='p-2 text-center h-14 grid place-content-center text-sm border-t'
                >
                  <h1
                    className={cn(
                      currentMonth ? 'text-gray-900' : 'text-gray-400',
                      today ? 'bg-blue-700 hover:bg-blue-700 text-white' : '',
                      selectDate.toDate().toDateString() ===
                        date.toDate().toDateString()
                        ? today
                          ? 'bg-blue-700 text-white hover:bg-blue-700'
                          : 'bg-gray-900 text-white hover:bg-gray-900'
                        : '',
                      'h-10 w-10 rounded-full grid place-content-center transition-all cursor-pointer select-none'
                    )}
                    onClick={() => {
                      setSelectDate(date);
                      hasAppointment && !hasAppointments && startLoading();
                    }}
                  >
                    {date.date()}
                    <div
                      className={`h-1.5 w-1.5 rounded-full bg-red-500 m-auto ${
                        hasAppointment ? 'visible' : 'invisible'
                      }`}
                    ></div>
                  </h1>
                </div>
              );
            }
          )}
        </div>
      </div>
      <div className='paddingLeft flex-1'>
        <h1 className='font-semibold text-lg'>
          Schedule for {selectDate.format('dddd MMM D, YYYY')}
        </h1>
        <Button color='blue' className='mt-4' onClick={() => setOpen(true)}>
          <HiOutlinePlus size={20} className='mr-[6px]' />
          New appointment
        </Button>
        <div className='h-[1px] w-full bg-gray-200 my-8'></div>
        <Appointments appointments={appointments} selectDate={selectDate} />
      </div>
    </div>
  );
};

export default Calendar;
