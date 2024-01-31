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
