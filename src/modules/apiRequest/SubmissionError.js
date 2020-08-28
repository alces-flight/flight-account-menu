export default class SubmissionError extends Error {
  constructor(errorMessageMap, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SubmissionError)
    }

    this.name = 'SubmissionError'
    // A map from field name to error message.
    this.errorMessageMap = errorMessageMap;
  }
}
