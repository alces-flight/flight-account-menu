import apiRequest from '../modules/apiRequest';

// Runs the given validator and reformats the response to that accepted by
// `react-hook-form`.
export function resolver(validator) { 
  return function(data) {
    const errors = validator(data);

    const massagedResponse = {
      values: Object.keys(errors).length === 0 ? data : {},
      errors: Object.keys(errors).reduce((accum, fieldName) => {
        accum[fieldName] = {
          message: errors[fieldName],
          path: fieldName,
        }
        return accum;
      }, {})
    };
    return massagedResponse;
  };
}

export function settingErrors(action, setError) {
  return async function(data) {
    try {
      return await action(data);
    } catch(e) {
      if (e instanceof apiRequest.SubmissionError) {
        Object.keys(e.errorMessageMap).forEach(fieldName => {
          setError(fieldName, {
            message: [e.errorMessageMap[fieldName]],
            path: fieldName,
          });
        });
      } else {
        setError('Unexpected', {
          message: 'An unexpected error',
          path: '.',
        });
      }
    }
  }
}
