import { useState } from 'react';

import apiRequest from './modules/apiRequest';

const useForm = (callback) => {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }
    callback(inputs).
      catch((e) => {
        if (e instanceof apiRequest.SubmissionError) {
          setErrors(e.errorMessageMap)
        } else {
          throw e
        }
      })
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
    // XXX Focusing the input ought to set touched too.
    setTouched(touched => ({...touched, [event.target.name]: true}));
    setInputs(inputs => ({...inputs, [event.target.name]: newValue}));
  }
  return {
    handleSubmit,
    handleInputChange,
    inputs,
    errors,
    touched,
  };
}

export default useForm;
