import React from 'react'
import { connect } from 'react-redux';

import auth from '../../modules/auth';

function SignedOut({ currentUser, dispatch }) {
  return (
    <button
      className="ml-3 btn btn-success mr-1 pl-3 pr-4 text-uppercase font-weight-bold"
      style={{ marginTop: '12px' }}
      type="submit"
      onClick={(evt) => {
        dispatch(auth.actions.showLoginForm());
        evt.preventDefault();
      }}
    >
      <i className="px-1 fa fa-user"></i>
      Log in
    </button>
  );
}

export default connect()(SignedOut);
