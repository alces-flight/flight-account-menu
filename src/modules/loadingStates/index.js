/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Reactware.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

// Import and export the public facing API for the loadingStates module.

import * as constants from './constants';
import * as selectors from './selectors';
import reducer from './reducer';
import withLoadingStates from './withLoadingStates';

export default {
  constants,
  reducer,
  selectors,
  withLoadingStates,
};
