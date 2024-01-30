/* eslint-disable react/prop-types */
import apiUrl from '@/api';
import { Button, Label, Modal, Select, TextInput } from 'flowbite-react';
import { handleKeyPress } from '@/helpers/helpers';
import { emailRegex, phoneRegex, whitespaceRegex } from '@/helpers/regex';
import { useState } from 'react';
import { useAppContext as ClientContext } from '@/components/contexts/ClientContext';

const AddClient = ({ setOpen, isOpen, setSaved }) => {
  const { setClients } = ClientContext();

  // Initial client state
  const initialClientState = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    membershipType: 'basic',
    sessions: '',
    active: true,
  };

  // Initialize new client with initial client state
  const [newClient, setNewClient] = useState(initialClientState);

  const [errMsg, setErrMsg] = useState({});
  const newErrors = {};

  const handleAddClient = async () => {
    // Form validation
    if (!newClient.firstName || whitespaceRegex.test(newClient.firstName)) {
      newErrors.firstName = 'Enter a valid name';
      setErrMsg(newErrors);
    }

    if (!newClient.lastName || whitespaceRegex.test(newClient.lastName)) {
      newErrors.lastName = 'Enter a valid last name';
      setErrMsg(newErrors);
    }

    if (!newClient.email || !emailRegex.test(newClient.email)) {
      newErrors.email = 'Enter a valid email address';
      setErrMsg(newErrors);
    }

    if (!newClient.phone || !phoneRegex.test(newClient.phone)) {
      newErrors.phone = 'Enter valid phone number';
      setErrMsg(newErrors);
    }

    if (!newClient.sessions || whitespaceRegex.test(newClient.sessions)) {
      newErrors.sessions = 'Enter a number of sessions';
      setErrMsg(newErrors);
    }

    if (Object.keys(newErrors).length === 0) {
      try {
        const res = await fetch(`${apiUrl}/dashboard/addClient`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newClient),
          credentials: 'include',
        });

        const data = await res.json();
        console.log(data);

        // Check if user already exists
        if (res.status === 409) {
          newErrors.email = 'Client already exists';
          setErrMsg(newErrors);
        } else if (res.status === 201) {
          setClients((prevClients) => [...prevClients, data.newClient]);
          setNewClient(initialClientState);
          setSaved(true);
          setOpen(false);
          setErrMsg('');
          setTimeout(() => {
            setSaved(false);
          }, 2000);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prevInputs) => {
      return {
        ...prevInputs,
        [name]: value,
      };
    });
  };

  return (
    <>
      <Modal
        onClose={() => {
          setOpen(false);
          setNewClient(initialClientState);
          setErrMsg('');
        }}
        show={isOpen}
        className='modalParent'
      >
        <Modal.Header className='border-b border-gray-200 !p-6 dark:border-gray-700'>
          <strong>Add new client</strong>
        </Modal.Header>
        <Modal.Body>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <div>
              <Label htmlFor='firstName'>First name</Label>
              <div className='mt-1'>
                <TextInput
                  id='firstName'
                  name='firstName'
                  placeholder='Bonnie'
                  type='text'
                  value={newClient.firstName}
                  color={errMsg.firstName ? 'failure' : 'gray'}
                  helperText={errMsg.firstName && errMsg.firstName}
                  className='textInput'
                  onChange={() => {
                    handleInputChange(event);
                    setErrMsg((prevMsg) => ({
                      ...prevMsg,
                      firstName: '',
                    }));
                  }}
                />
              </div>
            </div>
            <div>
              <Label htmlFor='lastName'>Last name</Label>
              <div className='mt-1'>
                <TextInput
                  id='lastName'
                  name='lastName'
                  type='text'
                  placeholder='Green'
                  value={newClient.lastName}
                  color={errMsg.lastName ? 'failure' : 'gray'}
                  helperText={errMsg.lastName && errMsg.lastName}
                  className='textInput'
                  onChange={() => {
                    handleInputChange(event);
                    setErrMsg((prevMsg) => ({
                      ...prevMsg,
                      lastName: '',
                    }));
                  }}
                />
              </div>
            </div>
            <div>
              <Label htmlFor='email'>Email</Label>
              <div className='mt-1'>
                <TextInput
                  id='email'
                  name='email'
                  type='text'
                  placeholder='example@fitnessbuddy.com'
                  value={newClient.email}
                  color={errMsg.email ? 'failure' : 'gray'}
                  helperText={errMsg.email && errMsg.email}
                  className='textInput'
                  onChange={() => {
                    handleInputChange(event);
                    setErrMsg((prevMsg) => ({
                      ...prevMsg,
                      email: '',
                    }));
                  }}
                />
              </div>
            </div>
            <div>
              <Label htmlFor='phone'>Phone number</Label>
              <div className='mt-1'>
                <TextInput
                  id='phone'
                  name='phone'
                  type='text'
                  placeholder='123-456-7890'
                  value={newClient.phone}
                  color={errMsg.phone ? 'failure' : 'gray'}
                  helperText={errMsg.phone && errMsg.phone}
                  className='textInput'
                  onChange={() => {
                    handleInputChange(event);
                    setErrMsg((prevMsg) => ({
                      ...prevMsg,
                      phone: '',
                    }));
                  }}
                />
              </div>
            </div>
            <div>
              <Label htmlFor='membershipType'>Membership Type</Label>
              <div className='mt-1'>
                <Select
                  id='membershipType'
                  name='membershipType'
                  value={newClient.membershipType}
                  className='selectInput'
                  onChange={() => {
                    handleInputChange(event);
                    setErrMsg((prevMsg) => ({
                      ...prevMsg,
                      membershipType: '',
                    }));
                  }}
                >
                  <option value='basic'>Basic</option>
                  <option value='premium'>Premium</option>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor='sessions'>Sessions</Label>
              <div className='mt-1'>
                <TextInput
                  id='sessions'
                  name='sessions'
                  value={newClient.sessions}
                  type='text'
                  color={errMsg.sessions ? 'failure' : 'gray'}
                  helperText={errMsg.sessions && errMsg.sessions}
                  onKeyDown={() => handleKeyPress(event)}
                  className='textInput'
                  onChange={() => {
                    handleInputChange(event);
                    setErrMsg((prevMsg) => ({
                      ...prevMsg,
                      sessions: '',
                    }));
                  }}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color='blue'
            onClick={() => {
              handleAddClient();
            }}
          >
            Add client
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddClient;
