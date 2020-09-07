import React, { useContext } from 'react'
import classNames from 'classnames';
import { connect } from 'react-redux';
import jsGravatar from 'js-gravatar';

import { Context as ConfigContext } from '../../ConfigContext';
import account from '../../modules/account';
import auth from '../../modules/auth';

import styles from '../../styles.module.css';

function SignedIn({ currentUser, dispatch }) {
  const { signedInLinks } = useContext(ConfigContext);

  const avatarUrl = currentUser.avatarUrl ?
    currentUser.avatarUrl :
    jsGravatar({ email: currentUser.email, size: 48, defaultImage: 'identicon' });

  return (
    <div className="dropdown align-self-center">
      <a className="nav nav-link dropdown-toggle px-4 d-inline-flex"
        id="account-menu"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        href="#"
      >
        <span
          className={
            classNames(
              "align-self-center mr-2 user-block",
              styles.userBlock,
              { 'user-name--null': currentUser.name == null },
            )
          }
        >
          <span className="font-weight-bold user-name">
            { currentUser.name || <React.Fragment>&nbsp;</React.Fragment> }
          </span><br />
          <span className="d-inline-block float-right user-username">
            { currentUser.username }
          </span>
        </span>
        <span className="align-self-center user-avatar">
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
