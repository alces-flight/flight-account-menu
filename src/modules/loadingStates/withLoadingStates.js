/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Reactware.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/
import lodash from 'lodash';
import { static as Immutable } from 'seamless-immutable';

import { NAME, PENDING, RESOLVED, REJECTED } from './constants';


const setLoadingStateNew = matchingConfig => state => {
  const { relationshipPath, resourceType, key, loadingState } = matchingConfig;
  let path;
  if (relationshipPath) {
    path = [
      resourceType, 'meta', NAME, key, 'relationships', ...relationshipPath
    ];
  } else {
    path = [resourceType, 'meta', NAME, key, 'self'];
  }
  const hasEverResolved = lodash.get(state, [...path, 'hasEverResolved']) ||
    loadingState === RESOLVED;
  return Immutable.setIn(state, path, {
    hasEverResolved,
    state: loadingState,
  });
};

function getResource(action) {
  if (action.meta == null) { return undefined; }
  if (action.meta.previousAction) {
    if (action.meta.previousAction.meta == null) { return undefined; }
    return action.meta.previousAction.meta.entity;
  }
  return action.meta.entity;
}

function getRelationName(action) {
  if (action.meta == null) { return undefined; }
  if (action.meta.previousAction) {
    if (action.meta.previousAction.meta == null) { return undefined; }
    return action.meta.previousAction.meta.relationName;
  }
  return action.meta.relationName;
}

function getLoadingState(config, action) {
  const self = config.self || config;
  const actionTypes = [self.pending, self.resolved, self.rejected];
  const actionTypesIndex = actionTypes.findIndex(c => c === action.type);
  return [PENDING, RESOLVED, REJECTED][actionTypesIndex];
}

function actionMatches(matchingActions, actionType) {
  const { pending, resolved, rejected } = matchingActions;
  return [pending, resolved, rejected].includes(actionType);
}

function getMatchingConfig(configs, action) {
  const resource = getResource(action);
  if (resource == null) { return undefined; }
  let relationName = null;
  let relationFlavour = null;

  const config = configs.find(c => {
    if (c.resourceType !== resource.type) {
      return false;
    }
    relationName = null;
    relationFlavour = null;
    let am = actionMatches(c.self || c, action.type);
    if (am) { return am; }
    am = actionMatches(c.relationship.related || c.relationship || {}, action.type);
    if (am) {
      relationName = getRelationName(action);
      relationFlavour = 'related';
      return am;
    }
    am = actionMatches(c.relationship.self || {}, action.type);
    if (am) {
      relationName = getRelationName(action);
      relationFlavour = 'self';
      return am;
    }
    return undefined;
  });
  if (config == null) { return undefined; }

  let loadingState;
  switch (relationFlavour) {
    case 'related':
      loadingState = getLoadingState(config.relationship.related || config.relationship, action);
      break;
    case 'self':
      loadingState = getLoadingState(config.relationship.self, action);
      break;
    default:
      loadingState = getLoadingState(config.self || config, action);
  }
  return {
    key: config.key(resource),
    loadingState,
    relationshipPath: relationName ? [relationName, relationFlavour] : null,
    resourceType: config.resourceType,
  };
}

// Higher order reducer to maintain loading states for resources.
//
// The configuration should be an array of "loading state configs".  As an
// example, the following is used by the clusters model in Flight Launch.
//
//     [{
//       // The name of the resource that the loading state applies to, e.g.,
//       // 'clusters'.
//       resourceType: constants.NAME,
//
//       // A function returning a unique key for the resource.  This might be
//       // the resources id, or some other key.
//       key: resource => resource.meta.loadingStates.key || resource.attributes.hostname,
//
//       self: {
//         // The action type when a request for this resource is dispatched.
//         pending: jsonApi.actionTypes.RESOURCE_REQUESTED,
//
//         // The action type when a request for this resource is rejected.
//         rejected: apiRequest.rejected(jsonApi.actionTypes.RESOURCE_REQUESTED),
//
//         // The action type when a request for this resource is resolved.
//         resolved: apiRequest.resolved(jsonApi.actionTypes.RESOURCE_REQUESTED),
//       },
//
//       relationship: {
//         related: {
//           // The action type when a request for a relationship for this
//           // resource is dispatched.
//           pending: jsonApi.actionTypes.RELATION_REQUESTED,
//
//           // The action type when a request for a relationship for this
//           // resource is rejected.
//           rejected: apiRequest.rejected(jsonApi.actionTypes.RELATION_REQUESTED),
//
//           // The action type when a request for a relationship for this
//           // resource is resolved.
//           resolved: apiRequest.resolved(jsonApi.actionTypes.RELATION_REQUESTED),
//         },
//         self: {
//           // The action type when a request for the linkage data for a
//           // relationship for this resource is dispatched.
//           pending: jsonApi.actionTypes.LINKAGE_DATA_REQUESTED,
//
//           // The action type when a request for the linkage data for a
//           // relationship for this resource is rejected.
//           rejected: apiRequest.rejected(jsonApi.actionTypes.LINKAGE_DATA_REQUESTED),
//
//           // The action type when a request for the linkage data for a
//           // relationship for this resource is resolved.
//           resolved: apiRequest.resolved(jsonApi.actionTypes.LINKAGE_DATA_REQUESTED),
//         },
//       },
//     }]
//
// With the above configuration, there will then be an additional property on
// the "clusters" state slice, e.g.,
//
//     state = {
//       clusters: {
//         data: {...},
//         meta: {
//           loadingState: {
//             [resource key]: {
//               self: {
//                 state: 'PENDING' | 'RESOLVED' | 'REJECTED'
//               }
//               relationship: {
//                 [relation name]: {
//                   related: {
//                     state: 'PENDING' | 'RESOLVED' | 'REJECTED'
//                   },
//                   self: {
//                     state: 'PENDING' | 'RESOLVED' | 'REJECTED'
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//
// Currently this is limited to working only with the jsonApi reducer.  This
// limitation could be removed by:
//
//  1. extending the configuration to allowing specifying how to retrieve the
//     entitiesById map.
//
const withLoadingStates = configs => {
  if (!Array.isArray(configs)) { configs = [configs]; }
  return wrappedReducer => (state, action) => {
    const newState = wrappedReducer(state, action);

    const matchingConfig = getMatchingConfig(configs, action);
    if (matchingConfig == null) {
      return newState;
    }

    return setLoadingStateNew(matchingConfig)(newState);
  };
};
export default withLoadingStates;
