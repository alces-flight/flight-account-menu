import * as v from "../../utils/validation";
import account from '../../modules/account';

export const registrationValidator = v.createValidator({
  username: account.validations.usernameValidator,
  email: account.validations.emailValidator,
  // password validation is connected by the PasswordField component. This
  // allows easy access to the zxcvbn password score.
  passwordConfirmation: account.validations.passwordConfirmationValidator,
  terms: [v.accepted],
});
