/*=============================================================================
 * Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Prime.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import {
  ENTITIES_ADDED,
  RELATION_REQUESTED,
  RESOURCE_CREATION_REQUESTED,
  RESOURCE_REQUESTED,
} from './actionTypes';
import apiRequest from "../../modules/apiRequest";

// Update (or create) the index for a single config entry.
function updateIndex(state, configEntry) {
  if (state[configEntry.entityType] == null) {
    return state;
  }

  const { entityType, indexName, indexAttribute } = configEntry;
  const entitiesById = state[entityType].data || {};

  const updatedIndex = Object.keys(entitiesById).reduce(
    (accum, entityId) => {
      const entity = entitiesById[entityId];
      /* eslint-disable no-param-reassign */
      accum[indexAttribute(entity)] = entity.id;
      /* eslint-enable no-param-reassign */
      return accum;
    },
    {},
  );

  return {
    ...state,
    [entityType]: {
      ...state[entityType],
      index: {
        ...state[entityType].index,
        [indexName]: updatedIndex,
      },
    },
  };
}

// Update (or create) the indexes for all config entries.
function updateIndexes(newState, config) {
  return config.reduce(
    updateIndex,
    newState,
  );
}

// Higher order reducer to maintain indexes of the state.
//
// The configuration should be an array of "index configs", e.g.,
//
//     [{
//       entityType: 'packages',
//       indexName: 'path',
//       indexAttribute: entity => entity.attributes.path,
//     }]
//
// With the above configuration, there will then be an additional property on
// the "packages" entity, e.g.,
//
//     state = {
//       packages: {
//         data: {...},
//         index: {
//           path: {
//             aPath: anId,
//             anotherPath: anotherId,
//             ...
//           }
//         }
//       }
//     }
//
// Currently this is limited to working only with the jsonApi reducer.  This
// limitation could be removed by:
//
//  1. allowing the actions for which it updates the index to be specified in
//     the configuration.
//  2. extending the configuration to allowing specifying how to retrieve the
//     entitiesById map.
//
const withIndexes = config => wrappedReducer => (state, action) => {
  const newState = wrappedReducer(state, action);

  switch (action.type) {
    case ENTITIES_ADDED:
    case apiRequest.resolved(RELATION_REQUESTED):
    case apiRequest.resolved(RESOURCE_CREATION_REQUESTED):
    case apiRequest.resolved(RESOURCE_REQUESTED):
      return updateIndexes(newState, config);

    default:
      return newState;
  }
};

export default withIndexes;
