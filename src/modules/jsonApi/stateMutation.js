/*=============================================================================
 * Copyright (C) 2016,2018 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Alces Prime.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

/*=============================================================================
 * Based on code taken from
 * https://github.com/dixieio/redux-json-api/blob/master/src/state-mutation.js
 * under the MIT license.
 * https://github.com/dixieio/redux-json-api/blob/master/package.json
 *===========================================================================*/

import lodash from 'lodash';
import pluralize from 'pluralize';
import { static as Immutable } from 'seamless-immutable';

const { find, get, has, hasIn, isPlainObject, reduce } = lodash;

// Useful utilities missing from seamless-immutable.
function mergeIn(object, path, patches, options) {
  return Immutable.updateIn(
    object,
    path,
    currentValue => (
      currentValue ?
        Immutable.merge(currentValue, patches, options) :
        Immutable(patches)
    ),
  );
}

function withoutIn(object, path, attribute) {
  return Immutable.updateIn(
    object,
    path,
    currentEntity => Immutable.without(currentEntity, attribute),
  );
}

const pathToEntity = entity => [entity.type, 'data', entity.id];
const pathToEntityClientMeta = entity =>
  pathToEntity(entity).concat(['meta', 'client']);
const pathToEntityRelationships = entity =>
  pathToEntity(entity).concat(['relationships']);

const removeEntityFromRelation = (entity, relationLinkageData) => {
  if (relationLinkageData === undefined) {
    // If we've not yet loaded the linkage data from the server, we don't
    // create it here.
    return relationLinkageData;
  }

  return relationLinkageData.filter(
    item => item.type !== entity.type || item.id !== entity.id,
  );
};

const addEntityToRelation = (entity, relationLinkageData) => {
  if (relationLinkageData === undefined) {
    // If we've not yet loaded the linkage data from the server, we don't
    // create it here.
    return relationLinkageData;
  }

  if (find(relationLinkageData, entity)) {
    return relationLinkageData;
  }

  return relationLinkageData.concat(entity);
};

const updateReverseRelationship = (
  entity,
  relationship,
  newRelation = {
    type: entity.type,
    id: entity.id,
  },
) => ((foreignEntities) => {
  if (!has(foreignEntities, get(relationship, ['data', 'id']))) {
    return foreignEntities;
  }

  return Immutable.update(
    foreignEntities,
    get(relationship, ['data', 'id']),
    (foreignEntity) => {
      const [singular, plural] = [1, 2].map(i => pluralize(entity.type, i));
      const relCase = [singular, plural].find(r => hasIn(foreignEntity, ['relationships', r]));

      if (!relCase) {
        return foreignEntity;
      }

      return Immutable.updateIn(
        foreignEntity,
        ['relationships', relCase, 'data'],
        (relationLinkageData) => {
          if (relCase === singular) {
            return newRelation;
          }

          if (newRelation == null) {
            return removeEntityFromRelation(entity, relationLinkageData);
          }

          return addEntityToRelation(newRelation, relationLinkageData);
        },
      );
    },
  );
});

const updateOrInsertEntityKeepingClientMeta = (state, entity) => {
  const existingClientMetaPath = pathToEntityClientMeta(entity);

  const newStateWithoutClientMeta = mergeIn(
    state,
    pathToEntity(entity),
    entity,
    { deep: true }
  );
  const existingClientMeta = get(state, existingClientMetaPath);

  if (existingClientMeta != null) {
    return mergeIn(
      newStateWithoutClientMeta,
      existingClientMetaPath,
      existingClientMeta,
    );
  }
  return newStateWithoutClientMeta;
};

const updateOrInsertEntity = (state, entity) => {
  if (isPlainObject(entity) === false) {
    return state;
  }

  const newState = updateOrInsertEntityKeepingClientMeta(state, entity);
  const rels = entity.relationships;

  if (!rels) {
    return newState;
  }

  return reduce(rels, (s, relationship) => {
    const relatedEntitiesPath = [
      get(relationship, ['data', 'type']),
      'data',
    ];

    if (hasIn(s, relatedEntitiesPath) === false) {
      return s;
    }

    return Immutable.updateIn(
      s,
      relatedEntitiesPath,
      updateReverseRelationship(entity, relationship),
    );
  }, newState);
};

export const removeEntityFromState = (state, entity) => {
  const newState = withoutIn(state, [entity.type, 'data'], entity.id);

  const rels = entity.relationships;
  if (!rels) {
    return newState;
  }

  return reduce(rels, (s, relationship) => {
    const entityPath = [
      get(relationship, ['data', 'type']),
      'data',
    ];

    if (hasIn(s, entityPath) === false) {
      return s;
    }

    return Immutable.updateIn(
      s,
      entityPath,
      updateReverseRelationship(entity, relationship, null),
    );
  }, newState);
};

export const removeEntitiesFromState = (state, entityType) => {
  const entities = get(state, [entityType, 'data']);
  return reduce(
    entities,
    removeEntityFromState,
    state,
  );
};

export const updateOrInsertEntitiesIntoState = (state, entities) => (
  reduce(
    entities,
    updateOrInsertEntity,
    state,
  )
);

export const patchMeta = (state, entity, metaPatches) => {
  if (entity.id == null) { return state; }
  return mergeIn(
    state,
    pathToEntityClientMeta(entity),
    metaPatches,
    { deep: true },
  );
};

export const patchLinksData = (state, entity, linksPatches) => (
  mergeIn(
    state,
    pathToEntityRelationships(entity),
    linksPatches,
    { deep: true },
  )
);
