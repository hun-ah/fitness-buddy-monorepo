import {
  formatPhoneNumber,
  formatFirstName,
  formatLastName,
} from '@/helpers/helpers';

export const loginInputs = (formInputs, errMsg) => {
  return [
    {
      label: {
        htmlFor: 'email',
        labelValue: 'Email',
      },
      input: {
        id: 'email',
        inputValue: formInputs.email,
        errMsg: errMsg.email,
        name: 'email',
        placeholder: 'name@fitnessbuddy.com',
        type: 'text',
      },
    },
    {
      label: {
        htmlFor: 'password',
        labelValue: 'Password',
      },
      input: {
        id: 'password',
        inputValue: formInputs.password,
        errMsg: errMsg.password,
        name: 'password',
        type: 'password',
      },
    },
  ];
};

export const registerInputs = (formInputs, errMsg) => {
  return [
    {
      label: {
        htmlFor: 'firstName',
        labelValue: 'First Name',
      },
      input: {
        id: 'firstName',
        inputValue: formInputs.firstName,
        errMsg: errMsg.firstName,
        name: 'firstName',
        placeholder: 'Jane',
        type: 'text',
      },
    },
    {
      label: {
        htmlFor: 'lastName',
        labelValue: 'Last Name',
      },
      input: {
        id: 'lastName',
        inputValue: formInputs.lastName,
        errMsg: errMsg.lastName,
        name: 'lastName',
        placeholder: 'Doe',
        type: 'text',
      },
    },
    {
      label: {
        htmlFor: 'phone',
        labelValue: 'Phone number',
      },
      input: {
        id: 'phone',
        inputValue: formInputs.phone,
        errMsg: errMsg.phone,
        name: 'phone',
        placeholder: '647-123-4567',
        type: 'text',
      },
    },
    {
      label: {
        htmlFor: 'email',
        labelValue: 'Email',
      },
      input: {
        id: 'email',
        inputValue: formInputs.email,
        errMsg: errMsg.email,
        name: 'email',
        placeholder: 'name@fitnessbuddy.com',
        type: 'text',
      },
    },
    {
      label: {
        htmlFor: 'password',
        labelValue: 'Password',
      },
      input: {
        id: 'password',
        inputValue: formInputs.password,
        errMsg: errMsg.password,
        name: 'password',
        type: 'password',
      },
    },
    {
      label: {
        htmlFor: 'confirm-password',
        labelValue: 'Confirm password',
      },
      input: {
        id: 'confirmPassword',
        inputValue: formInputs.confirmPassword,
        errMsg: errMsg.confirmPassword,
        name: 'confirmPassword',
        type: 'password',
      },
    },
  ];
};

export const profileInputs = (formInputs, errMsg, user) => {
  return [
    {
      label: {
        htmlFor: 'firstName',
        labelValue: 'First Name',
      },
      input: {
        id: 'firstName',
        inputValue: formInputs.firstName,
        errMsg: errMsg.firstName,
        name: 'firstName',
        placeholder: user.firstName,
        type: 'text',
      },
    },
    {
      label: {
        htmlFor: 'lastName',
        labelValue: 'Last Name',
      },
      input: {
        id: 'lastName',
        inputValue: formInputs.lastName,
        errMsg: errMsg.lastName,
        name: 'lastName',
        placeholder: user.lastName,
        type: 'text',
      },
    },
    {
      label: {
        htmlFor: 'email',
        labelValue: 'Email',
      },
      input: {
        id: 'email',
        inputValue: formInputs.email,
        errMsg: errMsg.email,
        name: 'email',
        placeholder: user.email,
        type: 'text',
      },
    },
    {
      label: {
        htmlFor: 'phone',
        labelValue: 'Phone number',
      },
      input: {
        id: 'phone',
        inputValue: formInputs.phone,
        errMsg: errMsg.phone,
        name: 'phone',
        placeholder: formatPhoneNumber(user.phone),
        type: 'text',
      },
    },
    {
      label: {
        htmlFor: 'password',
        labelValue: 'Password',
      },
      input: {
        id: 'password',
        inputValue: formInputs.password,
        errMsg: errMsg.password,
        name: 'password',
        placeholder: '••••••••',
        type: 'password',
      },
    },
    {
      label: {
        htmlFor: 'confirmPassword',
        labelValue: 'Confirm password',
      },
      input: {
        id: 'confirmPassword',
        inputValue: formInputs.password,
        errMsg: errMsg.password,
        name: 'password',
        placeholder: '••••••••',
        type: 'password',
      },
    },
  ];
};

export const clientProfileInputs = (formInputs, errMsg, client) => {
  return [
    {
      label: {
        htmlFor: 'firstName',
        labelValue: 'First Name',
      },
      input: {
        id: 'firstName',
        inputValue: formInputs.firstName,
        errMsg: errMsg.firstName,
        name: 'firstName',
        placeholder: formatFirstName(client.firstName),
        type: 'text',
      },
    },
    {
      label: {
        htmlFor: 'lastName',
        labelValue: 'Last Name',
      },
      input: {
        id: 'lastName',
        inputValue: formInputs.lastName,
        errMsg: errMsg.lastName,
        name: 'lastName',
        placeholder: formatLastName(client.lastName),
        type: 'text',
      },
    },
    {
      label: {
        htmlFor: 'email',
        labelValue: 'Email',
      },
      input: {
        id: 'email',
        inputValue: formInputs.email,
        errMsg: errMsg.email,
        name: 'email',
        placeholder: client.email,
        type: 'text',
      },
    },
    {
      label: {
        htmlFor: 'phone',
        labelValue: 'Phone number',
      },
      input: {
        id: 'phone',
        inputValue: formInputs.phone,
        errMsg: errMsg.phone,
        name: 'phone',
        placeholder: formatPhoneNumber(client.phone),
        type: 'text',
      },
    },
    {
      label: {
        htmlFor: 'sessions',
        labelValue: 'Phone number',
      },
      input: {
        id: 'sessions',
        inputValue: formInputs.sessions,
        errMsg: errMsg.sessions,
        name: 'sessions',
        placeholder: client.sessions,
        type: 'text',
      },
    },
  ];
};
