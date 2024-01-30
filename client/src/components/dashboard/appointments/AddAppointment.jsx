/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useAppContext as ClientContext } from '@/components/contexts/ClientContext';
import { useAppContext as AppointmentContext } from '@/components/contexts/AppointmentContext';
import { Modal, Button, TextInput, Label, Select, Card } from 'flowbite-react';
import { formatFirstName, formatLastName } from '@/helpers/helpers';
import { generateTimeOptions, differenceInMinutes } from '@/helpers/calendar';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import apiUrl from '@/api';

const AddAppointment = ({ setOpen, isOpen, selectDate, setSaved }) => {
  const { setAppointments, setDaysWithAppointments } = AppointmentContext();
  const { clients } = ClientContext();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const formattedDate = selectDate.format('YYYY-MM-DD');

  const initialAppointmentState = {
    clientName: '',
    clientId: '',
    date: formattedDate,
    appointmentStart: '',
    appointmentEnd: '',
    duration: '',
    lateCancel: false,
    checkedIn: false,
  };

  const [newAppointment, setNewAppointment] = useState(initialAppointmentState);

  // Filter clients
  const filteredClients =
    clients &&
    clients.filter((client) =>
      (
        client.firstName.toLowerCase() +
        ' ' +
        client.lastName.toLowerCase()
      ).includes(searchTerm.toLowerCase())
    );

  const showFilteredClients = searchTerm !== '' && filteredClients.length === 0;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prevInputs) => {
      return {
        ...prevInputs,
        [name]: value,
      };
    });
  };

  // Update date when date changes
  useEffect(() => {
    setNewAppointment((prevState) => ({
      ...prevState,
      date: formattedDate,
    }));
  }, [formattedDate]);

  // Update clientName and clientId when search changes
  useEffect(() => {
    const targetFirstName = searchTerm.split(' ')[0];
    const targetLastName = searchTerm.split(' ')[1];

    if (targetFirstName && targetLastName) {
      const targetClient = clients.find(
        (client) =>
          client.firstName === targetFirstName.toLowerCase() &&
          client.lastName === targetLastName.toLowerCase()
      );
      setNewAppointment((prevState) => ({
        ...prevState,
        clientId: targetClient ? targetClient._id : '',
      }));
    }

    setNewAppointment((prevState) => ({
      ...prevState,
      clientName: searchTerm,
    }));
  }, [searchTerm, clients]);

  // Update client when appointment time changes
  useEffect(() => {
    const difference = differenceInMinutes(
      newAppointment.appointmentStart,
      newAppointment.appointmentEnd
    );
    if (difference === 30) {
      setNewAppointment((prevState) => ({
        ...prevState,
        duration: '30 min',
      }));
    } else if (difference === 60) {
      setNewAppointment((prevState) => ({
        ...prevState,
        duration: '1 hr',
      }));
    }
  }, [
    setNewAppointment,
    newAppointment.appointmentEnd,
    newAppointment.appointmentStart,
  ]);

  const [errMsg, setErrMsg] = useState({});
  const newErrors = {};

  const handleSubmit = async () => {
    // Form validation
    const fullName = newAppointment.clientName.toLowerCase().trim();
    const names = fullName.split(' ');
    let firstName = '';
    let lastName = '';

    if (names.length > 1) {
      firstName = names[0];
      lastName = names.slice(1).join('');
    } else {
      firstName = names[0];
    }

    const doesMatch = clients.some(
      (client) =>
        client.firstName.toLowerCase() === firstName &&
        client.lastName.toLowerCase() === lastName
    );

    if (!doesMatch) {
      newErrors.clientName = 'Enter valid client';
      setErrMsg(newErrors);
    }

    if (newAppointment.appointmentStart === '') {
      newErrors.appointmentStart = 'Enter start time';
      setErrMsg(newErrors);
    }

    if (newAppointment.appointmentEnd === '') {
      newErrors.appointmentEnd = 'Enter end time';
      setErrMsg(newErrors);
    }

    const difference = differenceInMinutes(
      newAppointment.appointmentStart,
      newAppointment.appointmentEnd
    );
    if (difference > 60) {
      newErrors.appointmentTime = 'Appointment must not exceed 1 hr';
      setErrMsg(newErrors);
    } else if (difference < 30) {
      newErrors.appointmentTime = 'Appointment must be 30 mins minimum';
      setErrMsg(newErrors);
    }

    if (Object.keys(newErrors).length === 0) {
      try {
        const res = await fetch(`${apiUrl}/dashboard/addAppointment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAppointment),
          credentials: 'include',
        });
        const data = await res.json();
        console.log(data);
        if (res.status === 200) {
          setSaved(true);
          setOpen(false);
          setSearchTerm('');
          setNewAppointment(initialAppointmentState);
          setDaysWithAppointments((prevState) => {
            if (prevState.includes(data.appointment.appointmentDate)) {
              return prevState;
            } else {
              return [...prevState, data.appointment.appointmentDate];
            }
          });
          setAppointments((prevState) => {
            return {
              ...prevState,
              [formattedDate]: [
                ...(prevState[formattedDate] || []),
                data.appointment,
              ],
            };
          });
          setErrMsg({});
          setTimeout(() => {
            setSaved(false);
          }, 2000);
        } else if (res.status === 201) {
          setErrMsg((prevMsg) => ({
            ...prevMsg,
            clientName: data.message,
          }));
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Modal
      onClose={() => {
        setOpen(false);
        setSearchTerm('');
        setNewAppointment(initialAppointmentState);
        setErrMsg({});
      }}
      show={isOpen}
      onClick={() => {
        setShowSearch(false);
      }}
    >
      <Modal.Header className='border-b border-gray-200 !p-6 dark:border-gray-700'>
        <strong>
          New appointment on{' '}
          <span className='text-blue-700'>
            {selectDate.format('dddd MMM D, YYYY')}
          </span>
        </strong>
      </Modal.Header>
      <Modal.Body>
        <form className='flex flex-col gap-4 max-w-[300px]'>
          <div>
            <Label htmlFor='phone'>Client</Label>
            <div className='flex flex-col relative mt-1 inputContainer'>
              <TextInput
                id='client'
                name='client'
                type='search'
                className='remove-round w-full textInput'
                placeholder='Search clients'
                value={searchTerm}
                color={errMsg.clientName ? 'failure' : 'gray'}
                helperText={errMsg.clientName && errMsg.clientName}
                onChange={() => {
                  handleSearch(event);
                  setErrMsg((prevMsg) => ({
                    ...prevMsg,
                    clientName: '',
                  }));
                }}
                onFocus={() => setShowSearch(true)}
                onClick={(e) => e.stopPropagation()}
              />
              <HiMagnifyingGlass
                className='absolute top-[12px] left-[10px]'
                fill='#6b7280'
                size={18}
              />
            </div>
            {showSearch && (
              <Card
                className={`${
                  errMsg.clientName ? 'mt-[-20px]' : 'mt-2'
                } w-full text-sm text-gray-500 searchCard absolute z-10 max-w-[300px]`}
              >
                <ul className='flex flex-col gap-3 max-h-[80px] overflow-y-auto'>
                  {clients.length === 0 ? (
                    <div>
                      <p>No clients available</p>
                    </div>
                  ) : showFilteredClients ? (
                    <div>
                      <p>No clients match you search</p>
                    </div>
                  ) : (
                    filteredClients &&
                    filteredClients.map((client) => (
                      <li
                        className='cursor-pointer'
                        key={client._id}
                        onClick={() => {
                          setSearchTerm(
                            formatFirstName(client.firstName) +
                              ' ' +
                              formatLastName(client.lastName)
                          );
                          setErrMsg((prevMsg) => ({
                            ...prevMsg,
                            clientName: '',
                          }));
                        }}
                      >
                        {formatFirstName(client.firstName) +
                          ' ' +
                          formatLastName(client.lastName)}
                      </li>
                    ))
                  )}
                </ul>
              </Card>
            )}
          </div>
          <div>
            <div>
              <Label htmlFor='appointmentStart'>Appointment time</Label>
            </div>
            <div className='flex  gap-4 mt-1'>
              <div>
                <Select
                  id='appointmentStart'
                  name='appointmentStart'
                  className='min-w-[126px] selectInput'
                  value={newAppointment.appointmentStart}
                  color={
                    errMsg.appointmentEnd || errMsg.appointmentTime
                      ? 'failure'
                      : 'gray'
                  }
                  helperText={
                    errMsg.appointmentStart && errMsg.appointmentStart
                  }
                  onChange={() => {
                    handleInputChange(event);
                    setErrMsg((prevMsg) => ({
                      ...prevMsg,
                      appointmentStart: '',
                    }));
                    setErrMsg((prevMsg) => ({
                      ...prevMsg,
                      appointmentTime: '',
                    }));
                  }}
                >
                  {generateTimeOptions()}
                </Select>
              </div>
              <span className='flex h-[42px] items-center'>to</span>
              <Select
                id='appointmentEnd'
                name='appointmentEnd'
                className='min-w-[126px] selectInput'
                value={newAppointment.appointmentEnd}
                color={
                  errMsg.appointmentEnd || errMsg.appointmentTime
                    ? 'failure'
                    : 'gray'
                }
                helperText={errMsg.appointmentEnd && errMsg.appointmentEnd}
                onChange={() => {
                  handleInputChange(event);
                  setErrMsg((prevMsg) => ({
                    ...prevMsg,
                    appointmentEnd: '',
                  }));
                  setErrMsg((prevMsg) => ({
                    ...prevMsg,
                    appointmentTime: '',
                  }));
                }}
              >
                {generateTimeOptions()}
              </Select>
            </div>
            {errMsg.appointmentTime && (
              <span className='text-sm text-red-600 block mt-2'>
                {errMsg.appointmentTime}
              </span>
            )}
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button color='blue' onClick={handleSubmit}>
          Book appointment
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddAppointment;
