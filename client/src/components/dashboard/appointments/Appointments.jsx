/* eslint-disable react/prop-types */
import Appointment from './Appointment';
import SkeletonCard from './SkeletonCard';
import { useAppContext as ClientContext } from '@/components/contexts/ClientContext';
import { useAppContext as IsLoading } from '@/components/contexts/IsLoadingContext';

const Appointments = ({ appointments, selectDate }) => {
  const { clients } = ClientContext();
  const { isLoading } = IsLoading();
  const selectedDateAppointments =
    appointments[selectDate.format('YYYY-MM-DD')] || [];
  const appointmentCount = selectedDateAppointments.length;

  const hasAppointments = Object.prototype.hasOwnProperty.call(
    appointments,
    selectDate.format('YYYY-MM-DD')
  );

  return (
    <div className='flex flex-col gap-2 mt-[10px]'>
      <div>
        {!hasAppointments && isLoading ? (
          <span className='text-gray-500 text-sm block mt-[-8px]'>
            Loading appointments...
          </span>
        ) : (
          <span className='text-gray-500 text-sm block mt-[-8px]'>
            {appointmentCount > 0
              ? `${appointmentCount} appointment${
                  appointmentCount > 1 ? 's' : ''
                } booked`
              : 'No appointments to show'}
          </span>
        )}
        <ul className='flex flex-col gap-2 mt-[10px]'>
          {!hasAppointments && isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            selectedDateAppointments
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
          )}
        </ul>
      </div>
    </div>
  );
};

export default Appointments;
