import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import styled from 'styled-components';

import * as actions from '../actions';

const AlignedButton = styled(Button)`
  &.btn {
    vertical-align: baseline;
    padding: 0;
  }
`;

const SignInLink = ({ children, showLoginForm }) => {
  return (
    <AlignedButton
      color="link"
      href="/sign-in"
      onClick={(evt) => { showLoginForm(); evt.preventDefault(); }}
      size="md"
      tag="a"
    >
      {children}
    </AlignedButton>
  );
};

SignInLink.propTypes = {
  children: PropTypes.node.isRequired,
  showLoginForm: PropTypes.func.isRequired,
};

const enhance = compose(
  connect(null, { showLoginForm: actions.showLoginForm }),
);

export default enhance(SignInLink);
