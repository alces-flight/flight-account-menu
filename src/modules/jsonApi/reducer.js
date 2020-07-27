/*=============================================================================
 * Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Prime.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

import {
  ENTITIES_ADDED,
  ENTITIES_REMOVED,
  ENTITY_REMOVED,
  LINKAGE_DATA_REQUESTED,
  PATCH_META,
  RELATION_REQUESTED,
  RESOURCE_CREATION_REQUESTED,
  RESOURCE_DELETION_REQUESTED,
  RESOURCE_REQUESTED,
  RESOURCE_UPDATE_REQUESTED,
} from './actionTypes';
import {
  patchLinksData,
  patchMeta,
  removeEntitiesFromState,
  removeEntityFromState,
  updateOrInsertEntitiesIntoState,
} from './stateMutation';
import {
  buildLinksData,
  entitiesFromJsonApiResponse,
  entityFromActionPayload,
  entityFromResolvedRequest,
} from './utils';
import apiRequest from "../../modules/apiRequest";

const { resolved } = apiRequest;

// Update or insert entities for all appropriate actions.
function updateOrInsertEntitiesReducer(state, { type, payload }) {
  let entities;

  switch (type) {
    // This list of actions must be kept up to date with the list of actions
    // in withIndexes.
    case ENTITIES_ADDED:
    case resolved(RELATION_REQUESTED):
    case resolved(RESOURCE_CREATION_REQUESTED):
    case resolved(RESOURCE_UPDATE_REQUESTED):
    case resolved(RESOURCE_REQUESTED):
      entities = entitiesFromJsonApiResponse(payload.data);

      return updateOrInsertEntitiesIntoState(state, entities);

    default:
      return state;
  }
}

// Remove a single entity from the state for all appropriate actions.
function removeEntityReducer(state, { type, payload, meta }) {
  let entity;

  switch (type) {
    case ENTITY_REMOVED:
      entity = payload.data;
      break;

    case resolved(RESOURCE_DELETION_REQUESTED):
      entity = entityFromResolvedRequest(meta);
      break;

    default:
      return state;
  }

  return removeEntityFromState(state, entity);
}

// Remove all entities for the given entity type.  Useful for clearing
// sensitive data when a user logs out.
function removeEntitiesReducer(state, { type, payload }) {
  switch (type) {
    case ENTITIES_REMOVED:
      const entityType = payload.data.type;

      return removeEntitiesFromState(state, entityType);

    default:
      return state;
  }
}

// Update an entities meta data.
function patchMetaReducer(state = {}, { type, payload }) {
  switch (type) {
    case PATCH_META:
      const entity = entityFromActionPayload(payload);

      return patchMeta(state, entity, payload.data.meta);

    default:
      return state;
  }
}

// Update an entities linkage data to one of its relationships.
function patchLinkageDataReducer(state = {}, { type, payload, meta }) {
  switch (type) {
    case resolved(LINKAGE_DATA_REQUESTED):
      const entity = entityFromResolvedRequest(meta);

      return patchLinksData(state, entity, buildLinksData(payload, meta));

    default:
      return state;
  }
}

function reduceReducers(...reducers) {
  return (state, action) =>
    reducers.reduce(
      (s, r) => r(s, action),
      state,
    );
}

const jsonApiReducer = reduceReducers(
  updateOrInsertEntitiesReducer,
  removeEntityReducer,
  removeEntitiesReducer,
  patchMetaReducer,
  patchLinkageDataReducer,
);

export default jsonApiReducer;
