import { useState, useEffect } from 'react';
import { Button, Label, TextInput, Spinner } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import {
  emailRegex,
  whitespaceRegex,
  phoneRegex,
  passwordRegex,
} from '@/helpers/regex';
import apiUrl from '@/api';

const Register = () => {
  const navigate = useNavigate();

  const [registered, setRegistered] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formInputs, setFormInputs] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const getRegister = async () => {
      try {
        const res = await fetch(`${apiUrl}/register`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (res.status === 401) {
          navigate('/dashboard/home');
        }
      } catch (err) {
        console.log(err);
      }
    };
    getRegister();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prevInputs) => {
      return {
        ...prevInputs,
        [name]: value,
      };
    });
  };

  const [errMsg, setErrMsg] = useState({});
  const newErrors = {};

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formInputs.firstName || whitespaceRegex.test(formInputs.firstName)) {
      newErrors.firstName = 'Enter a valid name';
      setErrMsg(newErrors);
    }

    if (!formInputs.lastName || whitespaceRegex.test(formInputs.lastName)) {
      newErrors.lastName = 'Enter a valid last name';
      setErrMsg(newErrors);
    }

    if (!formInputs.phone || !phoneRegex.test(formInputs.phone)) {
      newErrors.phone = 'Enter valid phone number';
      setErrMsg(newErrors);
    }

    if (!formInputs.email || !emailRegex.test(formInputs.email)) {
      newErrors.email = 'Enter a valid email address';
      setErrMsg(newErrors);
    }

    if (!formInputs.password || !passwordRegex.test(formInputs.password)) {
      newErrors.password =
        'Password must be at least 8 characters long, contain at least one uppercase and lowercase letter and contain one digit';
      setErrMsg(newErrors);
    }

    if (
      !formInputs.confirmPassword ||
      formInputs.password != formInputs.confirmPassword
    ) {
      newErrors.confirmPassword = 'Passwords must match';
      setErrMsg(newErrors);
    }

    // Submit user info if no errors
    if (Object.keys(newErrors).length === 0) {
      const newClient = { ...formInputs };

      try {
        const res = await fetch(`${apiUrl}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newClient),
        });

        const data = await res.json();

        // Check if user already exists
        if (res.status === 409) {
          newErrors.email = 'User already exists';
          setErrMsg(newErrors);
        } else if (res.status === 201) {
          console.log(data);
          setRegistered(true);
          setTimeout(() => {
            setSuccess(true);
          }, 2000);
          setTimeout(() => {
            navigate('/login');
          }, 4000);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <section className='bg-white dark:bg-gray-900 flex-1 items-center px-4'>
      <form
        className='flex max-w-md flex-col gap-4 mx-auto py-[130px]'
        onSubmit={() => handleFormSubmit(event)}
      >
        <div>
          <div className='mb-2 block'>
            <Label
              htmlFor='firstName'
              value='First name'
              color={errMsg.name ? 'failure' : 'gray'}
            />
          </div>
          <TextInput
            id='firstName'
            name='firstName'
            type='text'
            value={formInputs.firstName}
            shadow
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
        <div>
          <div className='mb-2 block'>
            <Label
              htmlFor='lastName'
              value='Last name'
              color={errMsg.lastName ? 'failure' : 'gray'}
            />
          </div>
          <TextInput
            id='lastName'
            name='lastName'
            type='text'
            value={formInputs.lastName}
            shadow
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
        <div>
          <div className='mb-2 block'>
            <Label
              htmlFor='phone'
              value='Phone number'
              color={errMsg.phone ? 'failure' : 'gray'}
            />
          </div>
          <TextInput
            id='phone'
            name='phone'
            type='text'
            value={formInputs.phone}
            placeholder='647-123-4567'
            shadow
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
        <div>
          <div className='mb-2 block'>
            <Label
              htmlFor='email'
              value='Email'
              color={errMsg.email ? 'failure' : 'gray'}
            />
          </div>
          <TextInput
            id='email'
            name='email'
            type='text'
            value={formInputs.email}
            placeholder='name@fitnessbuddy.com'
            shadow
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
        <div>
          <div className='mb-2 block'>
            <Label
              htmlFor='password'
              value='Password'
              color={errMsg.password ? 'failure' : 'gray'}
            />
          </div>
          <TextInput
            id='password'
            name='password'
            type='password'
            value={formInputs.password}
            shadow
            color={errMsg.password ? 'failure' : 'gray'}
            helperText={errMsg.password && errMsg.password}
            className='textInput'
            onChange={() => {
              handleInputChange(event);
              setErrMsg((prevMsg) => ({
                ...prevMsg,
                password: '',
              }));
            }}
          />
        </div>
        <div>
          <div className='mb-2 block'>
            <Label
              htmlFor='confirm-password'
              value='Confirm password'
              color={errMsg.confirmPassword && 'failure'}
            />
          </div>
          <TextInput
            id='confirm-password'
            name='confirmPassword'
            type='password'
            value={formInputs.confirmPassword}
            shadow
            color={errMsg.confirmPassword ? 'failure' : 'gray'}
            helperText={errMsg.confirmPassword && errMsg.confirmPassword}
            className='textInput'
            onChange={() => {
              handleInputChange(event);
              setErrMsg((prevMsg) => ({
                ...prevMsg,
                confirmPassword: '',
              }));
            }}
          />
        </div>
        {registered ? (
          <Button color={success ? 'success' : 'blue'}>
            {success ? (
              <span className='pl-3'>Success! Heading to login page...</span>
            ) : (
              <>
                <Spinner aria-label='Spinner button example' size='sm' />
                <span className='pl-3'>Creating account...</span>
              </>
            )}
          </Button>
        ) : (
          <Button type='submit' color='blue'>
            Register
          </Button>
        )}
      </form>
    </section>
  );
};

export default Register;
