import { createModalDataSelector, createModalSelector } from '../../utils/modals';

import { NAME } from './constants';

export const isSettingsModalShowing = createModalSelector(NAME, 'settings');
export const isConfirmationModalShowing = createModalSelector(NAME, 'confirmation');
export const wasEmailUpdated = createModalDataSelector(NAME, 'confirmation', 'meta', 'emailUpdated');
