/* eslint-disable react/prop-types */
import apiUrl from '@/api';
import { addClientInputs } from '@/props/props';
import { Button, Label, Modal, Select } from 'flowbite-react';
import { handleKeyPress } from '@/helpers/helpers';
import Input from '@/components/inputs/Input';
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

  // pass AddClient component state to addClientInputs (prevent errors in props.js file) and store in new variable to map over
  const inputs = addClientInputs(newClient, errMsg);

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
            {inputs.map((input) => (
              <Input
                key={input.label.htmlFor}
                label={input.label}
                input={input.input}
                handleInputChange={handleInputChange}
                setErrMsg={setErrMsg}
                onKeyDown={
                  input.input.name === 'sessions'
                    ? () => handleKeyPress(event)
                    : undefined
                }
              />
            ))}
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
