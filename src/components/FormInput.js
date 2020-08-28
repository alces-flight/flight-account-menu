import React from 'react';
import {
  FormFeedback,
  FormGroup,
  FormText,
  Label,
  Input,
} from 'reactstrap';

// XXX add styling here.
export const Feedback = FormFeedback;
// export const Feedback = styled(FormFeedback)`
//   display: block;
//   font-size: 12px;
//   min-height: 12px;
//   line-height: 12px;
//   margin: 5px;
// `;

const defaultErrorMap = {
  'blank': 'This must not be blank',
  'not_confirmed': 'This field must match the password',
  'invalid': 'This is not a valid value',
  'invalid_login_token': 'This must be either your email address, or your Flight username consisting of lowercase letters, numbers and hyphens (-).',
  'invalid_username_format': 'Usernames can only use lowercase letters, numbers and hypens (-), and must not start with a hyphen.',
  'not_accepted': 'You must accept the terms and conditions to continue.',
  'password_too_weak': 'The password is not strong enough',
  'required': 'This field is required',
  'too_long': 'This is too long',
  'too_short': 'This is too short'
};

function formattedErrors(error, completeErrorMap) {
  if (error == null) {
    return null;
  } else if (Array.isArray(error)) {
    return error.map(e => completeErrorMap[e] || e).join(', ');
  } else {
    return completeErrorMap[error] || error;
  }
}

const FormInput = ({
  check,
  errorMap,
  help,
  helpProps,
  hideLabel,
  input,
  label,
  meta: { error, touched }={},
  name,
  ...custom
}) => {
  const inputEl = (
    <Input
      id={name}
      name={name}
      valid={touched ? !error : undefined}
      {...input}
      value={input.value == null ? "" : input.value}
      {...custom}
    />
  );

  const completeErrorMap = { ...defaultErrorMap, ...errorMap };
  const errors = formattedErrors(error, completeErrorMap);

  return (
    <FormGroup check={check}>
      { check ? inputEl : null }
      <Label
        check={check}
        htmlFor={name}
        hidden={hideLabel}
      >
        {label}
      </Label>
      { ' ' }
      { help ? <FormText {...helpProps}>{help}</FormText> : '' }
      { check ? null : inputEl }
      { ' ' }
      { errors && touched ? <Feedback>{errors}</Feedback> : <Feedback /> }
      { ' ' }
    </FormGroup>
  );
};

FormInput.defaultProps = {
  errorMap: {}
};

FormInput.Feedback = Feedback;

export default FormInput;
