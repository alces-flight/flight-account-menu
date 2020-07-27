import React from 'react';

import {
  Form,
  FormGroup
} from 'reactstrap';

import {
  Field,
  clearSubmitErrors,
  propTypes as formPropTypes,
  reduxForm,
} from 'redux-form';

import HiddenButton from '../../../components/HiddenButton';
import FormInput from '../../../components/FormInput';
import { signInValidator } from '../validations';

const SignInForm = ({ handleSubmit, invalid, pristine, submitting, submitFailed }) => (
  <Form onSubmit={handleSubmit}>
    { submitFailed ? <p className='text-warning'>Please correct the errors below and try again.</p> : null }
    <FormGroup>
      <Field
        component={FormInput}
        id='login'
        label='Enter your Flight username or email address'
        name='login'
        type='text'
      />
    </FormGroup>
    <FormGroup>
      <Field
        component={FormInput}
        id='password'
        label='Enter your password'
        name='password'
        type='password'
      />
    </FormGroup>
    <FormGroup check>
      <Field
        check
        component={FormInput}
        help="Don't choose this on a shared or public computer"
        id='rememberMe'
        label='Remember me'
        name='permanent'
        type='checkbox'
      />
    </FormGroup>
    <HiddenButton
      disabled={submitting || invalid || pristine}
      type='submit'
    >
      Sign in
    </HiddenButton>
  </Form>
);

SignInForm.propTypes = {
  ...formPropTypes
};

export default reduxForm({
  destroyOnUnmount: false,
  form: 'signIn',
  validate: signInValidator,
  onChange: (values, dispatch, props) => {
    if (props.submitFailed) {
      // If the form submission failed, clear the error on the password field
      // when the username field is editted and vice-versa.
      dispatch(clearSubmitErrors('signIn'));
    }
  }
})(SignInForm);
