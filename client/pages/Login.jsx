import { useState, useEffect } from 'react';
import { Button, Label, TextInput, Spinner } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext as IsLoading } from '@/components/contexts/IsLoadingContext';
import apiUrl from '@/api';

const Login = () => {
  const navigate = useNavigate();
  const { isLoading, startLoading, stopLoading } = IsLoading();

  const [formInputs, setFormInputs] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prevInputs) => {
      return {
        ...prevInputs,
        [name]: value,
      };
    });
  };

  const setCookie = (name, value) => {
    document.cookie = `${name}=${value};path=/`;
  };

  useEffect(() => {
    const getLogin = async () => {
      try {
        const res = await fetch(`${apiUrl}/login`, {
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
    getLogin();
  }, [navigate]);

  const [errMsg, setErrMsg] = useState({});
  const newErrors = {};

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formInputs.email) {
      newErrors.email = 'Enter email address';
      setErrMsg(newErrors);
    }

    if (!formInputs.password) {
      newErrors.password = 'Enter password';
      setErrMsg(newErrors);
    }

    if (Object.keys(newErrors).length === 0) {
      const user = { ...formInputs };

      try {
        const res = await fetch(`${apiUrl}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
          credentials: 'include',
        });
        const data = await res.json();

        startLoading();
        // Check if user exists/password matches
        if (res.status === 401) {
          stopLoading();
          if (data.email) {
            newErrors.email = data.email;
            setErrMsg(newErrors);
          }
          if (data.password) {
            newErrors.password = data.password;
            setErrMsg(newErrors);
          }
        } else if (res.status === 200) {
          setTimeout(() => {
            navigate('/dashboard/home');
            setCookie('loggedIn', 'true');
          }, 2000);
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
              htmlFor='email'
              value='Email'
              color={errMsg.email && 'failure'}
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
              color={errMsg.password && 'failure'}
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
        {isLoading ? (
          <Button color='blue'>
            <Spinner aria-label='Spinner button example' size='sm' />
            <span className='pl-3'>Logging in...</span>
          </Button>
        ) : (
          <Button type='submit' color='blue'>
            Log in
          </Button>
        )}
      </form>
    </section>
  );
};

export default Login;
