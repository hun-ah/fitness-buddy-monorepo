import { useState, useEffect } from 'react';
import { Button, Spinner } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import {
  emailRegex,
  whitespaceRegex,
  phoneRegex,
  passwordRegex,
} from '@/helpers/regex';
import apiUrl from '@/api';
import Input from '@/components/inputs/Input';
import { registerInputs } from '@/props/props';

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

  // pass Register component state to registerInputs (prevent errors in props.js file) and store in new variable to map over
  const inputs = registerInputs(formInputs, errMsg);

  return (
    <section className='bg-white dark:bg-gray-900 flex-1 items-center px-4'>
      <form
        className='flex max-w-md flex-col gap-4 mx-auto py-[130px]'
        onSubmit={() => handleFormSubmit(event)}
      >
        {inputs.map((input) => (
          <Input
            key={input.label.htmlFor}
            label={input.label}
            input={input.input}
            handleInputChange={handleInputChange}
            setErrMsg={setErrMsg}
          />
        ))}
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
