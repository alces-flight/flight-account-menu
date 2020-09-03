import * as v from "../../utils/validation";
import account from "../account";
import auth from "../auth";

export const resetPasswordValidator = v.createValidator({
  // password validation is connected by the PasswordField component. This
  // allows easy access to the zxcvbn password score.
  password: auth.validations.passwordValidator,
  passwordConfirmation: account.validations.passwordConfirmationValidator,
});

export const requestTokenValidator = v.createValidator({
  email: auth.validations.emailValidator,
});
