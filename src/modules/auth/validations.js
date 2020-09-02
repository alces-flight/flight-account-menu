import * as v from "../../utils/validation";

const usernameFormat = (value) => {
  const usernameRegex = /^[a-z][-a-z0-9]*$/;
  if (value && !value.match(usernameRegex)) {
    return 'invalid_username_format';
  }
};

export const permissiveFormatUsernameValidator = [
  v.required,
  v.notBlank,
  v.maxLength(255),
  v.minLength(3)
];

export const usernameValidator = [
  ...permissiveFormatUsernameValidator,
  usernameFormat
];

export const emailValidator = [v.required, v.notBlank, v.email];

export const loginTokenValidator = [
  // We allow either a username or an email address as a login token.
  // To be considered invalid, therefore, the value must fail both sets
  // of validation; since we don't know which the user was aiming to
  // provide, we can really only give a generic message.
  (value) => {
    const emailErrors = v.composeRules(emailValidator)(value);
    if (emailErrors) {
      const usernameErrors = v.composeRules(usernameValidator)(value);
      if (usernameErrors) {
        return 'invalid_login_token';
      }
    }
  }
];

const passwordScoreRule = (password, allValues, props) => {
  if (v.isEmpty(password) || password.length < props.minLength) {
    // Another rule will report the error.
    return undefined;
  }
  if (allValues.passwordScore == null) {
    // We've been unable to load zxcvbn.  We don't mark the password as
    // invalid as this may be a permanent issue.
    return undefined;
  }
  if (allValues.passwordScore < props.minScore) {
    return 'password_too_weak';
  }
};

export const passwordRules = [
  v.required,
  v.notBlank,
  v.minLength(6),
  passwordScoreRule,
];

export const passwordValidator = v.composeRules(passwordRules);

export const signInValidator = v.createValidator({
  login: loginTokenValidator,
  password: passwordValidator
});

export const confirmPasswordValidator = v.createValidator({
  password: passwordValidator
});
