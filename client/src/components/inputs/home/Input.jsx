import { Label, TextInput } from 'flowbite-react';

const Input = ({ label, input, handleInputChange, setErrMsg }) => {
  const { htmlFor, labelValue } = label;
  const { id, name, type, placeholder, inputValue, errMsg } = input;

  return (
    <div>
      <div className='mb-2 block'>
        <Label
          htmlFor={htmlFor}
          value={labelValue}
          color={errMsg && 'failure'}
        />
      </div>
      <TextInput
        id={id}
        name={name}
        placeholder={placeholder}
        type={type}
        value={inputValue}
        shadow
        color={errMsg ? 'failure' : 'gray'}
        helperText={errMsg && errMsg}
        className='textInput'
        onChange={() => {
          handleInputChange(event);
          setErrMsg((prevMsg) => ({
            ...prevMsg,
            [name]: '',
          }));
        }}
      />
    </div>
  );
};

export default Input;
