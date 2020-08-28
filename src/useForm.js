import { useState } from 'react';

const useForm = (callback) => {
  const [inputs, setInputs] = useState({});
  function handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }
    callback(inputs);
  }
  function handleInputChange(event) {
    event.persist();
    let newValue;
    switch (event.target.type) {
      case 'checkbox':
      newValue = event.target.checked ? 1 : 0;
        break;
      default:
        newValue = event.target.value;
    }
    setInputs(inputs => ({...inputs, [event.target.name]: newValue}));
  }
  return {
    handleSubmit,
    handleInputChange,
    inputs
  };
}

export default useForm;
