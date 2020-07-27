import { createValidator } from "../../utils/validation";
import account from '../account';

export const signInValidator = createValidator({
  login: account.validations.loginTokenValidator,
  password: account.validations.passwordValidator
});

export const confirmPasswordValidator = createValidator({
  password: account.validations.passwordValidator
});
