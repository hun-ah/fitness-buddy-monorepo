/* eslint-disable react/prop-types */
import apiUrl from '@/api';
import Input from '@/components/inputs/Input';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { profileInputs } from '@/props/props';
import { useAppContext as ClientContext } from '@/components/contexts/ClientContext';
import { useAppContext as UserContext } from '@/components/contexts/UserContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  emailRegex,
  passwordRegex,
  phoneRegex,
  whitespaceRegex,
} from '@/helpers/regex';

const UpdateProfile = ({ setSaved }) => {
  const { user, setUser, clearUser } = UserContext();
  const { clearClients } = ClientContext();
  const navigate = useNavigate();

  const initialInputState = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const [formInputs, setFormInputs] = useState(initialInputState);

  const [errMsg, setErrMsg] = useState({});

  // Delete user modal
  const [openModal, setOpenModal] = useState(false);

  // Keep track of which inputs have been modified
  const [modifiedInputs, setmodifiedInputs] = useState({});
  const modifiedLength = Object.keys(modifiedInputs).length;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prevInputs) => {
      return {
        ...prevInputs,
        [name]: value,
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
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {};

    // set updatedData to values of modifiedInputs
    Object.keys(modifiedInputs).forEach((fieldName) => {
      if (modifiedInputs[fieldName]) {
        updatedData[fieldName] = formInputs[fieldName] || user[fieldName];
      }
    });

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
      modifiedInputs.password &&
      (!updatedData.password || !passwordRegex.test(updatedData.password))
    ) {
      newErrors.password =
        'Password must be at least 8 characters long, contain at least one uppercase and lowercase letter and contain one digit';
      setErrMsg(newErrors);
    }

    if (
      modifiedInputs.confirmPassword &&
      (!updatedData.confirmPassword ||
        updatedData.password != updatedData.confirmPassword)
    ) {
      newErrors.confirmPassword = 'Passwords must match';
      setErrMsg(newErrors);
    }

    // If no errors, submit data
    if (
      Object.keys(newErrors).length === 0 &&
      Object.keys(modifiedInputs).length > 0
    ) {
      try {
        const res = await fetch(`${apiUrl}/dashboard/updateProfile`, {
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
          setSaved(true);
          setFormInputs(initialInputState);
          setUser((prevState) => {
            return {
              ...prevState,
              ...updatedData,
            };
          });
          setTimeout(() => {
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

  const deleteCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`${apiUrl}/dashboard/deleteUser`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await res.json();
      console.log(data);

      if (res.status === 200) {
        navigate('/');
        deleteCookie('loggedIn');
        clearClients();
        clearUser();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const inputs = profileInputs(formInputs, errMsg, user);
  const nameInputs = inputs.slice(0, 2);
  const contactInputs = inputs.slice(2, 4);
  const securityInputs = inputs.slice(4, 6);

  return (
    <form
      className='flex flex-wrap gap-8 flex-col lg:flex-row'
      onSubmit={() => handleSubmit(event)}
    >
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
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button
                color='failure'
                onClick={() => {
                  setOpenModal(false);
                  handleDeleteUser();
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
      <div className='flex flex-col gap-4 flex-1'>
        <h2 className='text-md font-bold'>You</h2>
        {nameInputs.map((input) => (
          <Input
            key={input.label.htmlFor}
            label={input.label}
            input={input.input}
            handleInputChange={handleInputChange}
            setErrMsg={setErrMsg}
          />
        ))}
      </div>
      <div className='flex flex-col gap-4 flex-1'>
        <h2 className='text-md font-bold'>Contact</h2>
        {contactInputs.map((input) => (
          <Input
            key={input.label.htmlFor}
            label={input.label}
            input={input.input}
            handleInputChange={handleInputChange}
            setErrMsg={setErrMsg}
          />
        ))}
      </div>
      <div className='w-full'>
        <div className='lg:w-1/2 flex flex-col gap-4'>
          <h2 className='text-md font-bold'>Security</h2>
          {securityInputs.map((input) => (
            <Input
              key={input.label.htmlFor}
              label={input.label}
              input={input.input}
              handleInputChange={handleInputChange}
              setErrMsg={setErrMsg}
            />
          ))}
        </div>
      </div>
      <div className='pt-4 border-t-[1px] flex justify-between w-full mobilexs'>
        <div>
          <Button
            className='w-fit buttonxs'
            color='blue'
            disabled={modifiedLength > 0 ? false : true}
            type='submit'
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
            Delete account
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UpdateProfile;
