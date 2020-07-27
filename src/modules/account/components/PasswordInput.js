import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import FormInput from '../../../components/FormInput';

const scoreToColour = {
  0: '#D1462F',
  1: '#D1462F',
  2: '#57B8FF',
  3: '#57B8FF',
  4: '#2FBF71',
};
const scoreToWidth = {
  0: '20%',
  1: '40%',
  2: '60%',
  3: '80%',
  4: 'calc(100% - 2px)',
};


const PasswordStrengthDesc = styled.span`
  font-size: 12px;
  font-style: italic;
  line-height: 12px;
  min-height: 12px;
  padding: 14px 0 14px 12px;
  position: absolute;
  right: 0;
  text-align: right;
  top: 60px;
  transition: color 250ms ease-in-out;
  width: 15%;

  color: ${props => props.show ? scoreToColour[props.score] || 'transparent' : 'transparent'};
`;

const PasswordStrengthBar = styled.div`
  box-sizing: border-box;
  height: 2px;
  position: relative;
  top: -10px;
  right: 1px;
  transition: width 300ms ease-out;

  background: ${props => scoreToColour[props.score]};
  width: ${props => props.show ? scoreToWidth[props.score] || 0 : 0};
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  margin-bottom: -16px;
`;

const PasswordInput = ({
  input,
  score,
  scoreWords,
  ...rest,
}) => {
  const password = input.value;
  const showScoreIndicators = score != null && password.length > 0;
  return (
    <PasswordInputWrapper>
      <FormInput
        input={input}
        type='password'
        {...rest}
      />
      <PasswordStrengthBar
        score={score}
        show={showScoreIndicators}
      />
      <PasswordStrengthDesc
        score={score}
        show={showScoreIndicators}
      >
        {scoreWords[score]}
      </PasswordStrengthDesc>
    </PasswordInputWrapper>
  );
};


PasswordInput.propTypes = {
  ...FormInput.propTypes,
  score: PropTypes.number,
  scoreWords: PropTypes.arrayOf(
    PropTypes.string.isRequired,
  ).isRequired,
};

PasswordInput.defaultProps = {
  scoreWords: ['weak', 'weak', 'okay', 'good', 'strong'],
};

export default PasswordInput;
