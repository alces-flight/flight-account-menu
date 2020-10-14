import React, { useContext, useState } from 'react'
import classNames from 'classnames';
import jsGravatar from 'js-gravatar';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { connect } from 'react-redux';

import { Context as ConfigContext } from '../../ConfigContext';
import account from '../../modules/account';
import auth from '../../modules/auth';

import styles from '../../styles.module.css';

function SignedIn({ currentUser, dispatch }) {
  const { signedInLinks } = useContext(ConfigContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);

  const avatarUrl = currentUser.avatarUrl ?
    currentUser.avatarUrl :
    jsGravatar({ email: currentUser.email, size: 48, defaultImage: 'identicon' });

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle} className="align-self-center">
      <DropdownToggle
        tag="a"
        className="nav nav-link dropdown-toggle px-4 d-inline-flex"
        id="account-menu"
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
      </DropdownToggle>
      <DropdownMenu>
        {
          signedInLinks.map(link => <Link key={link.href} {...link} />)
        }
        <DropdownItem
          className="nav nav-link dropdown-item"
          onClick={ () => { dispatch(account.actions.showSettingsModal()); } }
          style={{ cursor: 'pointer' }}
          tag="a"
        >
          My account
        </DropdownItem>
        <DropdownItem
          className="nav nav-link dropdown-item"
          onClick={ () => { dispatch(auth.actions.logout()); } }
          style={{ cursor: 'pointer' }}
          tag="a"
        >
          Log out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

function Link({ href, text }) {
  return (
    <DropdownItem
      href={href}
      className="nav nav-link"
    >
      {text}
    </DropdownItem>
  );
}

export default connect()(SignedIn);
