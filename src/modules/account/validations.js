import auth from '../../modules/auth';

import * as v from "../../utils/validation";

export const passwordConfirmationValidator = [
  v.required,
  v.confirmationOf('password'),
];

export const conditionalPasswordValidator = v.composeRules(v.when(
  'changingPassword',
  auth.validations.passwordRules,
));

const conditionalPasswordConfirmationValidator = v.when(
  'changingPassword',
  passwordConfirmationValidator,
);

export const validator = v.createValidator({
  username: auth.validations.usernameValidator,
  email: auth.validations.emailValidator,
  currentPassword: conditionalPasswordValidator,
  // password validation is connected by the PasswordField component. This
  // allows easy access to the zxcvbn password score.
  passwordConfirmation: conditionalPasswordConfirmationValidator,
});

export const registrationValidator = v.createValidator({
  username: auth.validations.usernameValidator,
  email: auth.validations.emailValidator,
  // password validation is connected by the PasswordField component. This
  // allows easy access to the zxcvbn password score.
  passwordConfirmation: passwordConfirmationValidator,
  terms: [v.accepted],
});
