import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { zxcvbn, loadZxcvbn } from '../zxcvbn';
import { passwordValidator } from '../validations';
import PasswordInput from './PasswordInput';

const isTooShort = (password, minLength) => password.length < minLength;

class PasswordField extends React.Component {
  static propTypes = {
    minLength: PropTypes.number.isRequired,
    minScore: PropTypes.number.isRequired,
    userInputs: PropTypes.arrayOf(
      PropTypes.string
    ).isRequired,
    validator: PropTypes.func.isRequired,
  };

  static defaultProps = {
    minLength: 5,
    minScore: 2,
    userInputs: [],
    validator: passwordValidator,
  }

  constructor(...args) {
    loadZxcvbn().then(() => {
      this.setState({
        zxcvbnLoaded: true
      });
    });
    super(...args);
  }

  state = {
    score: null,
    zxcvbnLoaded: false,
  }

  handleChange = (event, ...args) => {
    const password = event.target.value;
    let score;

    if (!this.state.zxcvbnLoaded) {
      // If zxcvbn has not yet been loaded, we can't assign a score.
      score = null;
    } else {
      // Always sets a zero score when min length requirement is not met.
      // This avoids unnecessary zxcvbn computations (CPU intensive).
      if (isTooShort(password, this.props.minLength)) {
        score = 0;
      } else {
        const result = zxcvbn(password, this.props.userInputs);
        score = result.score;
      }
    }

    // Store the score in the state to have `Field` rerendered. Store the
    // score in the `syncScore` variable to have the updated value available
    // in the `validate` function.
    this.setState({
      score: score,
    });
    this.syncScore = score;
  }

  validate = (password, allValues, props) => {
    const { validator, ...rest } = this.props;
    return validator(
      password,
      { ...allValues, passwordScore: this.syncScore },
      { ...props, ...rest },
    );
  }

  render() {
    const {
      /* eslint-disable no-unused-vars */
      minLength,
      minScore,
      userInputs,
      validator,
      /* eslint-enable no-unused-vars */
      ...rest
    } = this.props;
    return (
      <Field
        component={PasswordInput}
        onChange={this.handleChange}
        score={this.state.score}
        validate={this.validate}
        {...rest}
      />
    );
  }
};

export default PasswordField;
