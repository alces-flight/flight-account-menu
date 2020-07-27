import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import {
  Form,
  FormGroup
} from 'reactstrap';
import {
  Field,
  reduxForm,
  propTypes as formPropTypes,
} from 'redux-form';

import auth from '../../../modules/auth';
import FormInput from '../../../components/FormInput';
import { conditionalPasswordValidator, validator } from '../validations';
import * as actions from '../actions';

import CollapsibleFormSection from './CollapsibleFormSection';
import PasswordField from './PasswordField';

const AccountSettingsForm = ({
  handleSubmit,
  invalid,
  pristine,
  submitFailed,
  submitting,
  user,
}) => (
  <Form onSubmit={handleSubmit}>
    {
      submitFailed ? (
        <p className='text-warning'>
          Please correct the errors below and try again.
        </p>
      ) : null
    }
    <FormGroup>
      <Field
        component={FormInput}
        id='username'
        label='User name'
        name='username'
        type='text'
      />
    </FormGroup>
    <FormGroup>
      <Field
        component={FormInput}
        id='email'
        label='Email address'
        name='email'
        type='email'
      />
    </FormGroup>
    <CollapsibleFormSection name="changingPassword">
      <FormGroup>
        <Field
          component={FormInput}
          id='currentPassword'
          label='Enter your current password'
          name='currentPassword'
          type='password'
        />
      </FormGroup>
      <FormGroup>
        <PasswordField
          id='password'
          label='Enter your new password'
          minLength={6}
          name='password'
          userInputs={[ user.email, user.username ]}
          validator={conditionalPasswordValidator}
        />
      </FormGroup>
      <FormGroup>
        <Field
          component={FormInput}
          id='passwordConfirmation'
          label='Confirm your new password'
          name='passwordConfirmation'
          type='password'
        />
      </FormGroup>
    </CollapsibleFormSection>
  </Form>
);

AccountSettingsForm.propTypes = {
  ...formPropTypes
};

const enhance = compose(
  connect(
    (state) => {
      const user = auth.selectors.currentUserSelector(state);
      if (user == null) {
        return {
          initialValues: {
            changingPassword: false
          },
        };
      }
      return {
        initialValues: {
          changingPassword: false,
          username: user.username,
          email: user.email,
        },
        user: user,
      };
    },
  ),

  reduxForm({
    destroyOnUnmount: false,
    form: 'accountSettings',
    onSubmit: (values, dispatch, { user }) => dispatch(actions.update(values, user)),
    validate: validator,
  })
);

export default enhance(AccountSettingsForm);
