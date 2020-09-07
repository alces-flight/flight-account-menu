import auth from './modules/auth';

const logics = [
  auth.logic.checkSessionExpiration,
];

export default (store) => {
  store.subscribe(() => {
    logics.forEach(logic => {
      logic(store.dispatch, store.getState);
    });
  });

  // Dispatch an action to ensure that any logics are called on page load.
  store.dispatch({ type: 'flight-account-menu/INIT' });
};
