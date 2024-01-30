/* eslint-disable react/prop-types */
import { Avatar, Card, Button } from 'flowbite-react';
import { AiFillClockCircle } from 'react-icons/ai';
import { HiTrash } from 'react-icons/hi2';
import { formatFirstName, formatLastName } from '@/helpers/helpers';
import { millisecondsToAMPM } from '@/helpers/calendar';
import { useAppContext as AppointmentContext } from '@/components/contexts/AppointmentContext';
import apiUrl from '@/api';

const Appointment = ({ appointment, client }) => {
  const {
    appointmentStart,
    appointmentEnd,
    appointmentDate,
    duration,
    _id,
    clientId,
    lateCancel,
    checkedIn,
  } = appointment;

  const { firstName, lastName, avatar } = client;

  const { setAppointments, setDaysWithAppointments } = AppointmentContext();

  // Convert apointment times to AMPM
  const [startTime, endTime] = millisecondsToAMPM(
    appointmentStart,
    appointmentEnd
  );

  const handleDeleteAppointment = async () => {
    try {
      const res = await fetch(`${apiUrl}/dashboard/deleteAppointment`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: _id }),
        credentials: 'include',
      });
      const data = await res.json();

      setAppointments((prevState) => {
        const updatedAppointments = prevState[appointmentDate].filter(
          (appointment) => appointment._id !== data.appointment._id
        );

        const nextState = {
          ...prevState,
          [appointmentDate]: updatedAppointments,
        };

        if (updatedAppointments.length === 0) {
          setDaysWithAppointments((prevState) => {
            const updatedDays = prevState.filter(
              (day) => day !== appointmentDate
            );

            delete nextState[appointmentDate];

            return updatedDays;
          });
        }

        return nextState;
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleLateCancel = async () => {
    try {
      await fetch(`${apiUrl}/dashboard/lateCancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointmentId: _id, clientId }),
        credentials: 'include',
      });

      setAppointments((prevState) => {
        const updatedAppointments = prevState[appointmentDate].map(
          (appointment) => {
            if (appointment._id === _id) {
              return {
                ...appointment,
                lateCancel: true,
              };
            }
            return appointment;
          }
        );

        return {
          ...prevState,
          [appointmentDate]: updatedAppointments,
        };
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckIn = async () => {
    try {
      await fetch(`${apiUrl}/dashboard/checkIn`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointmentId: _id, clientId }),
        credentials: 'include',
      });

      setAppointments((prevState) => {
        const updatedAppointments = prevState[appointmentDate].map(
          (appointment) => {
            if (appointment._id === _id) {
              return {
                ...appointment,
                checkedIn: true,
              };
            }
            return appointment;
          }
        );

        return {
          ...prevState,
          [appointmentDate]: updatedAppointments,
        };
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <li>
      <Card
        className={`appointmentCard ${
          lateCancel ? 'shadow-sm opacity-50' : 'shadow-md'
        }`}
      >
        <div className='flex flex-wrap justify-between w-full p-1 gap-4'>
          <div className='w-fit flex items-center'>
            <div className='flex gap-2 w-[200px]'>
              <div
                className='inline-flex justify-center items-center bg-primary-100 text-primary-800 text-xs font-medium  py-0.5 rounded
                dark:bg-primary-900 dark:text-primary-300 w-[145px]'
              >
                <AiFillClockCircle className='mr-1' />
                {startTime} - {endTime}
              </div>
              <div className='text-sm flex justify-start text-gray-900 w-fit'>
                {duration}
              </div>
            </div>
          </div>
          <div className='w-fit '>
            <div className='flex gap-3 items-center flex-2'>
              <Avatar rounded size='xs' img={avatar} />
              <span
                className={`text-gray-900 text-sm ${
                  (firstName + lastName).length > 14 ? 'truncate' : ''
                } w-[130px]`}
              >
                {formatFirstName(firstName) + ' ' + formatLastName(lastName)}
              </span>
            </div>
          </div>
          <div className='lg:w-fit sm:w-full lg:justify-end flex justify-between'>
            <div className='flex gap-2'>
              <Button
                color={checkedIn ? 'success' : 'blue'}
                size='xs'
                onClick={handleCheckIn}
                disabled={lateCancel || checkedIn ? true : false}
                className='w-[88px]'
              >
                {checkedIn ? 'Checked in' : 'Check in'}
              </Button>
              <Button
                color='gray'
                size='xs'
                className='cancel'
                onClick={handleLateCancel}
                disabled={lateCancel || checkedIn ? true : false}
              >
                Late cancel
              </Button>
              <Button
                color='gray'
                size='xs'
                className='cancel'
                onClick={handleDeleteAppointment}
              >
                <HiTrash />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </li>
  );
};

export default Appointment;
