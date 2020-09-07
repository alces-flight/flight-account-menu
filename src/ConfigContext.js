import React from 'react';

const initialState = null;
const Context = React.createContext(initialState);
const Provider = Context.Provider;

export {
  Context,
  Provider,
}
