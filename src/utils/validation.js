import _ from 'lodash';
import validatorUtils from 'validator';

// Compose a list of rules into a single rule which returns all errors from
// the rules in order or undefined if there are no errors.
export function composeRules(rules) {
  return (value, allValues, props) => {
    // Return the first error or undefined.
    //
    // The errors are flatten to better support redux-form arrays of fields.
    // This is safe as a single rule can return only a single error.
    const errors = _.flatten(
      rules.map(rule => rule(value, allValues, props)).filter(error => !!error)
    );
    if (errors.length) {
      return errors;
    } else {
      return undefined;
    }
  };
}

export function isJson(value) {
  if (isEmpty(value)) { return; }
  try {
    const o = JSON.parse(value);

    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the
    // type-checking, but...  JSON.parse(null) returns 'null', and
    // typeof null === "object", so we must check for that, too.
    if (o && typeof o === "object" && o !== null) {
      return;
    }
  } catch (e) {
    // eslint-disable-line no-empty
  }
  return 'invalid';
}

export function isEmpty(value) {
  return value === undefined || value === null || value === '';
}

// Permits undefined, null and empty strings, but does not permit non-empty
// blank strings.
export function notBlank(value) {
  if (!isEmpty(value) && value.match && value.match(/^\s+$/)) {
    return 'blank';
  }
}

export function email(value) {
  if (!isEmpty(value) && !validatorUtils.isEmail(value)) {
    return 'invalid';
  }
}

export function required(value) {
  if (isEmpty(value)) {
    return 'required';
  }
}

// Test the input against the provided regexp.
export function format(regexp) {
  return value => {
    if (!regexp.test(value)) {
      return "format";
    }
  };
}

export function minLength(min) {
  return value => {
    if (!isEmpty(value) && value.length < min) {
      return "too_short";
    }
  };
}

export function maxLength(max) {
  return value => {
    if (!isEmpty(value) && value.length > max) {
      return "too_long";
    }
  };
}

// Checks that the value is a decimal integer. Hexadecimal values, etc. will
// not be accepted.
export function decimalInteger(value) {
  if (isEmpty(value)) {
    return ;
  }
  const n = ~~Number(value);
  if (String(n) !== String(value)) {
    return 'not_a_decimal_integer';
  }
}

// Checks that the value is an integer. Hexadecimal values, etc. will be
// accepted.
export function integer(value) {
  if (!Number.isInteger(Number(value))) {
    return 'not_an_integer';
  }
}

export function positiveNumber(value) {
  if (isEmpty(value)) {
    return;
  }
  if (Number.isNaN(Number(value))) {
    return 'not_a_number';
  } else if (! (Number(value) > 0)) {
    return 'non_positive_number';
  }
}

export function nonNegativeNumber(value) {
  if (isEmpty(value)) {
    return;
  }
  if (Number.isNaN(Number(value))) {
    return 'not_a_number';
  } else if (Number(value) < 0) {
    return 'negative_number';
  }
}

export function oneOf(enumeration) {
  return value => {
    if (!~enumeration.indexOf(value)) {
      return `Must be one of: ${enumeration.join(', ')}`;
    }
  };
}

export function confirmationOf(confirms) {
  return (value, allValues) => {
    if (value !== allValues[confirms]) {
      return "not_confirmed";
    }
  };
}

export function accepted(value) {
  if (!value) {
    return "not_accepted";
  }
}

// Given a predicate and an array of rules, returns a new array of rules each
// of which will only validate when the predicate returns a truthy value.
//
// As a special case, the predicate can be a String, in which case it is taken
// to be the name of a form field.  The rules will validate when that form
// field has a truthy value.
export function when(predicate, rules) {
  if (_.isString(predicate)) {
    const booleanField = predicate;
    predicate = (value, allValues) => allValues[booleanField];
  }

  return _.map(rules, (rule) => {
    return (value, allValues, props) => {
      if (predicate(value, allValues, props)) {
        return rule(value, allValues, props);
      }
    };
  });
}
// Takes an array of rules and returns a new array of rules that validate
// against a mapped value.
//
// Each rule is validated against a the value returned by calling `mapper`
// with the original value.
//
// This can be used to validate a nested field, whilst recording errors
// against the original field.
export function mapValidationValue(mapper, rules) {
  return rules.map(rule => {
    return (value, allValues, props) =>
      rule(mapper(value, allValues, props), allValues, props);
  });
}


// Create a validator to validate an object.
//
// The object is validated against the given rules.
export function createValidator(rules) {
  return (data = {}, props = {}) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      // concat enables both functions and arrays of functions
      const rule = composeRules([].concat(rules[key]));
      const error = rule(data[key], data, props);
      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };
}


// Create a validator to validate an array of objects.
//
// Each object in the array is validated against the given rules.
export function createArrayValidator(rules) {
  return (data = [], props = {}) => {
    const errors = [];
    Object.keys(rules).forEach((key) => {
      // concat enables both functions and arrays of functions
      const rule = composeRules([].concat(rules[key]));
      data.forEach((datum, index) => {
        const error = rule(datum[key], datum, props);
        if (error) {
          errors[index] = errors[index] || {};
          errors[index][key] = error;
        }
      });
    });
    return errors;
  };
}
