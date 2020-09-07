import Cookies from 'universal-cookie';
import React from 'react'
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';

import createLogics from './logics';
import createReducer from './reducer';
import { Provider as ConfigProvider } from './ConfigContext';

import apiRequest from './modules/apiRequest';
import Menu from './components/Menu';

import AccountSettingsModal,
  { enhance as enhanceAccountSettingsModal } from './components/account/SettingsModal.js';
import AccountUpdatedModal,
  { enhance as enhanceAccountUpdatedModal } from './components/account/UpdatedModal.js';
import CompleteRecoveryModal,
  { enhance as enhanceCompleteRecoveryModal } from './components/accountRecovery/CompleteRecoveryModal.js';
import ConfirmPasswordModal,
  { enhance as enhanceConfirmPasswordModal } from './components/auth/ConfirmPasswordModal.js';
import ConfirmationModal,
  { enhance as enhanceConfirmationModal } from './components/confirmation/Modal.js';
import RegistrationModal,
  { enhance as enhanceRegistrationModal } from './components/registration/Modal.js';
import SignInForm,
  { enhance as enhanceSignInForm } from './components/signin/Form.js';
import SignInModal,
  { enhance as enhanceSignInModal } from './components/signin/Modal.js';
import StartRecoveryModal,
  { enhance as enhanceStartRecoveryModal } from './components/accountRecovery/StartRecoveryModal.js';
import WelcomeMessageModal,
  { enhance as enhanceWelcomeMessageModal } from './components/registration/WelcomeMessageModal.js';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const cookies = new Cookies();

export const store = createStore(
  createReducer(cookies),
  {},
  composeEnhancers(
    applyMiddleware(
      apiRequest.middleware,
      thunk,
    )
  )
);

createLogics(store);

const componentOverrideConfigurations = [
  // Modals
  ['AccountSettingsModal', enhanceAccountSettingsModal, AccountSettingsModal],
  ['AccountUpdatedModal', enhanceAccountUpdatedModal, AccountUpdatedModal],
  ['CompleteRecoveryModal', enhanceCompleteRecoveryModal, CompleteRecoveryModal],
  ['ConfirmationModal', enhanceConfirmationModal, ConfirmationModal],
  ['ConfirmPasswordModal', enhanceConfirmPasswordModal, ConfirmPasswordModal],
  ['RegistrationModal', enhanceRegistrationModal, RegistrationModal],
  ['SignInModal', enhanceSignInModal, SignInModal],
  ['StartRecoveryModal', enhanceStartRecoveryModal, StartRecoveryModal],
  ['WelcomeMessageModal', enhanceWelcomeMessageModal, WelcomeMessageModal],

  // Forms
  ['SignInForm', enhanceSignInForm, SignInForm],
];

export const AccountMenu = ({
  components,
  privacyPolicyUrl,
  signedInLinks,
  termsUrl,
}) => {
  components = components || {};
  const enhancedComponents = {};
  componentOverrideConfigurations.forEach((config) => {
    const [name, enhance, defaultComp] = config;
    enhancedComponents[name] = components[name] ? enhance(components[name]) : defaultComp;
  });

  return (
    <Provider store={store}>
      <ConfigProvider
        value={{
          privacyPolicyUrl: privacyPolicyUrl || "https://alces-flight.com/privacy",
          signedInLinks: signedInLinks || [],
          termsUrl: termsUrl || "https://alces-flight.com/terms",
          components: enhancedComponents,
        }}
      >
        <Menu />
      </ConfigProvider>
    </Provider>
  );
}
