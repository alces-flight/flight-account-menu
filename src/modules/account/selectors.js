import { createSelector } from 'reselect';

import loadingStates from '../loadingStates';
import { createModalDataSelector, createModalSelector } from '../../utils/modals';

import { NAME } from './constants';

const stateSelector = state => state[NAME];
const accountUpdateKey = state => 'accountUpdate';

export const isSettingsModalShowing = createModalSelector(NAME, 'settings');
export const isConfirmationModalShowing = createModalSelector(NAME, 'confirmation');
export const wasEmailUpdated = createModalDataSelector(NAME, 'confirmation', 'meta', 'emailUpdated');

export const retrieval = createSelector(
  stateSelector,
  accountUpdateKey,

  loadingStates.selectors.retrieval,
);
