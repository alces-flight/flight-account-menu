import React from 'react'
import { connect } from 'react-redux';

import account from '../../modules/account';
import auth from '../../modules/auth';

function SignedIn({ currentUser, dispatch, signedInLinks }) {
  const avatarUrl = currentUser.avatarUrl ?
    currentUser.avatarUrl :
    `https://api.adorable.io/avatars/48/${currentUser.email}.png`;
  return (
    <div className="dropdown align-self-center">
      <a className="nav nav-link dropdown-toggle px-4 d-inline-flex"
        id="account-menu"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        href="#"
      >
        <span className="align-self-center mr-2" style={{lineHeight: '1'}}>
          <span className="font-weight-bold">
            { currentUser.name || <span>&nbsp;</span> }
          </span><br />
          <span className="d-inline-block float-right">
            { currentUser.username }
          </span>
        </span>
        <span className="align-self-center">
          <img src={avatarUrl} />
        </span>
      </a>
      <div className="dropdown-menu text-uppercase" aria-labelledby="account-menu">
        {
          signedInLinks.map(link => <Link key={link.href} {...link} />)
        }
        <a
          href="#"
          className="nav nav-link dropdown-item"
          type="button"
          onClick={ () => { dispatch(account.actions.showSettingsModal()); } }
        >
          My account
        </a>
        <a
          href="#"
          className="nav nav-link dropdown-item"
          type="button"
          onClick={ () => { dispatch(auth.actions.logout()); } }
        >
          Log out
        </a>
      </div>
    </div>
  );
}

function Link({ href, text }) {
  return (
    <a
      href={href}
      className="nav nav-link dropdown-item"
      type="button"
    >
      {text}
    </a>
  );
}

export default connect()(SignedIn);
