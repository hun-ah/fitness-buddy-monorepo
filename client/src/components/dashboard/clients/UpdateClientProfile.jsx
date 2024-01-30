/* eslint-disable react/prop-types */
import apiUrl from '@/api';
import {
  Button,
  Label,
  Modal,
  Select,
  TextInput,
  ToggleSwitch,
} from 'flowbite-react';
import { handleKeyPress } from '@/helpers/helpers';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import {
  formatFirstName,
  formatLastName,
  formatPhoneNumber,
} from '@/helpers/helpers';
import { emailRegex, phoneRegex, whitespaceRegex } from '@/helpers/regex';
import { useEffect, useState } from 'react';
import { useAppContext as ClientContext } from '@/components/contexts/ClientContext';
import { useNavigate } from 'react-router-dom';

const UpdateClientProfile = ({ client, setSaved }) => {
  const navigate = useNavigate();
  let {
    firstName,
    lastName,
    email,
    phone,
    sessions,
    membershipType,
    active,
    _id,
  } = client;

  const initialInputState = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    membershipType: '',
    sessions: '',
    active: active,
  };

  const [formInputs, setFormInputs] = useState(initialInputState);

  const { clients, setClients } = ClientContext();

  const [errMsg, setErrMsg] = useState({});

  // Delete client modal
  const [openModal, setOpenModal] = useState(false);

  // Keep track of which inputs have been modified
  const [modifiedInputs, setmodifiedInputs] = useState({});
  const modifiedLength = Object.keys(modifiedInputs).length;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormInputs((prevInputs) => {
      return {
        ...prevInputs,
        [name]: name === 'active' ? !prevInputs.active : value,
      };
    });

    setmodifiedInputs({
      ...modifiedInputs,
      [name]: true,
    });
  };

  // Update inputs when modified
  useEffect(() => {
    setmodifiedInputs({});
  }, [client]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {};
    updatedData.id = _id;

    // set updatedData to values of modifiedInputs
    Object.keys(modifiedInputs).forEach((fieldName) => {
      if (modifiedInputs[fieldName]) {
        updatedData[fieldName] =
          (typeof formInputs[fieldName] === 'string'
            ? formInputs[fieldName].toLowerCase()
            : formInputs[fieldName]) || client[fieldName];
      }
    });

    if (modifiedInputs.active) {
      updatedData.active = formInputs.active;
    }

    const newErrors = {};

    // Form validation
    if (
      modifiedInputs.firstName &&
      (!updatedData.firstName || whitespaceRegex.test(updatedData.firstName))
    ) {
      newErrors.firstName = 'Enter a valid name';
      setErrMsg(newErrors);
    }

    if (
      modifiedInputs.lastName &&
      (!updatedData.lastName || whitespaceRegex.test(updatedData.lastName))
    ) {
      newErrors.lastName = 'Enter a valid last name';
      setErrMsg(newErrors);
    }

    if (
      modifiedInputs.phone &&
      (!updatedData.phone || !phoneRegex.test(updatedData.phone))
    ) {
      newErrors.phone = 'Enter valid phone number';
      setErrMsg(newErrors);
    }

    if (
      modifiedInputs.email &&
      (!updatedData.email || !emailRegex.test(updatedData.email))
    ) {
      newErrors.email = 'Enter a valid email address';
      setErrMsg(newErrors);
    }

    if (
      modifiedInputs.sessions &&
      (!updatedData.sessions || whitespaceRegex.test(updatedData.sessions))
    ) {
      newErrors.sessions = 'Enter a number of sessions';
      setErrMsg(newErrors);
    }

    // If no errors, submit data
    if (
      Object.keys(newErrors).length === 0 &&
      Object.keys(modifiedInputs).length > 0
    ) {
      try {
        const res = await fetch(`${apiUrl}/dashboard/updateClient`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
          credentials: 'include',
        });

        const data = await res.json();
        console.log(data);

        if (res.status === 200) {
          // Find client in clients context
          const updatedClientIndex = clients.findIndex(
            (client) => client._id === _id
          );

          // Update single client
          const updatedClients = [...clients];
          updatedClients[updatedClientIndex] = {
            ...updatedClients[updatedClientIndex],
            ...updatedData,
          };

          setSaved(true);

          // Set clients with updated client
          setClients(updatedClients);

          setTimeout(() => {
            setFormInputs({
              ...initialInputState,
              active: formInputs.active,
            });
            setSaved(false);
          }, 2000);
        } else if (res.status === 409) {
          newErrors.email = data.error;
          setErrMsg(newErrors);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleDeleteClient = async () => {
    try {
      const res = await fetch(`${apiUrl}/dashboard/deleteClient`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: _id }),
        credentials: 'include',
      });

      const data = await res.json();
      console.log(data);

      if (res.status === 200) {
        const updatedClients = clients.filter((client) => client._id !== _id);

        setClients(updatedClients);

        navigate('/dashboard/clients');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className='flex flex-col gap-8' onSubmit={() => handleSubmit(event)}>
      <Modal
        show={openModal}
        size='md'
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200' />
            <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this client?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button
                color='failure'
                onClick={() => {
                  setOpenModal(false);
                  handleDeleteClient();
                }}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button color='gray' onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className='flex flex-col lg:flex-row gap-8'>
        <div className='flex flex-col gap-4 w-full'>
          <h2 className='text-md font-bold'>Name</h2>
          <div className='flex flex-col'>
            <div className='mb-2 block'>
              <Label htmlFor='firstName' value='First name' />
            </div>
            <TextInput
              id='firstName'
              name='firstName'
              type='text'
              placeholder={formatFirstName(firstName)}
              value={formInputs.firstName}
              className='textInput'
              onChange={() => {
                handleInputChange(event);
                setErrMsg((prevMsg) => ({
                  ...prevMsg,
                  firstName: '',
                }));
              }}
              shadow
              color={errMsg.firstName ? 'failure' : 'gray'}
              helperText={errMsg.firstName && errMsg.firstName}
            />
          </div>
          <div className='flex flex-col'>
            <div className='mb-2 block'>
              <Label htmlFor='lastName' value='Last name' />
            </div>
            <TextInput
              id='lastName'
              name='lastName'
              type='text'
              placeholder={formatLastName(lastName)}
              value={formInputs.lastName}
              className='textInput'
              onChange={() => {
                handleInputChange(event);
                setErrMsg((prevMsg) => ({
                  ...prevMsg,
                  lastName: '',
                }));
              }}
              shadow
              color={errMsg.lastName ? 'failure' : 'gray'}
              helperText={errMsg.lastName && errMsg.lastName}
            />
          </div>
        </div>
        <div className='flex flex-col gap-4 w-full'>
          <h2 className='text-md font-bold'>Contact</h2>
          <div className='flex flex-col '>
            <div className='mb-2 block'>
              <Label htmlFor='email' value='Email' />
            </div>
            <TextInput
              id='email'
              name='email'
              type='text'
              placeholder={email}
              value={formInputs.email}
              className='textInput'
              onChange={() => {
                handleInputChange(event);
                setErrMsg((prevMsg) => ({
                  ...prevMsg,
                  email: '',
                }));
              }}
              shadow
              color={errMsg.email ? 'failure' : 'gray'}
              helperText={errMsg.email && errMsg.email}
            />
          </div>
          <div className='flex flex-col '>
            <div className='mb-2 block'>
              <Label htmlFor='phone' value='Phone number' />
            </div>
            <TextInput
              id='phone'
              name='phone'
              type='text'
              placeholder={formatPhoneNumber(phone)}
              value={formInputs.phone}
              className='textInput'
              onChange={() => {
                handleInputChange(event);
                setErrMsg((prevMsg) => ({
                  ...prevMsg,
                  phone: '',
                }));
              }}
              shadow
              color={errMsg.phone ? 'failure' : 'gray'}
              helperText={errMsg.phone && errMsg.phone}
            />
          </div>
        </div>
      </div>
      <div className='flex flex-col lg:flex-row gap-8'>
        <div className='flex flex-col gap-4 w-full'>
          <h2 className='text-md font-bold'>Sessions remaining</h2>
          <div className='flex flex-col'>
            <div className='mb-2 block'>
              <Label htmlFor='sessions' value='Sessions remaining' />
            </div>
            <TextInput
              id='sessions'
              name='sessions'
              type='text'
              placeholder={sessions}
              value={formInputs.sessions}
              onKeyDown={() => handleKeyPress(event)}
              className='textInput'
              onChange={() => {
                handleInputChange(event);
                setErrMsg((prevMsg) => ({
                  ...prevMsg,
                  sessions: '',
                }));
              }}
              shadow
              color={errMsg.sessions ? 'failure' : 'gray'}
              helperText={errMsg.sessions && errMsg.sessions}
            />
          </div>
        </div>
        <div className='flex flex-col gap-4 w-full'>
          <h2 className='text-md font-bold'>Account</h2>
          <div className='flex flex-col'>
            <div className='mb-2 block'>
              <Label htmlFor='membershipType' value='Membership type' />
            </div>
            <Select
              id='membershipType'
              name='membershipType'
              className='selectInput'
              onChange={() => {
                handleInputChange(event);
              }}
              shadow
            >
              <option defaultValue={true}>
                {membershipType.charAt(0).toUpperCase() +
                  membershipType.slice(1)}
              </option>
              <option>
                {membershipType === 'basic' ? 'Premium' : 'Basic'}
              </option>
            </Select>
          </div>
          <div className='flex flex-col w-fit'>
            <ToggleSwitch
              label='Active'
              className={`toggleInput ${
                formInputs.active ? 'isActive' : 'inactive'
              }`}
              checked={formInputs.active}
              onChange={() => {
                setFormInputs((prevInputs) => ({
                  ...prevInputs,
                  active: !prevInputs.active,
                }));

                setmodifiedInputs({
                  ...modifiedInputs,
                  active: true,
                });
              }}
            />
          </div>
        </div>
      </div>
      <div className='pt-4 border-t-[1px] flex justify-between w-full mobilexs'>
        <div>
          <Button
            className='w-fit buttonxs'
            color='blue'
            type='submit'
            disabled={modifiedLength > 0 ? false : true}
          >
            Save changes
          </Button>
        </div>
        <div>
          <Button
            className='buttonxs'
            color='failure'
            onClick={() => setOpenModal(true)}
          >
            Delete client
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UpdateClientProfile;
