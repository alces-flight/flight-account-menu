import invariant from 'invariant';
import lodash from 'lodash';
import apiRequest from "../../modules/apiRequest";

import {
  ENTITIES_ADDED,
  ENTITIES_REMOVED,
  ENTITY_REMOVED,
  LINKAGE_DATA_REQUESTED,
  PATCH_META,
  RELATIONS_ADDED,
  RELATIONS_REMOVED,
  RELATION_REQUESTED,
  RESOURCE_CREATION_REQUESTED,
  RESOURCE_DELETION_REQUESTED,
  RESOURCE_REQUESTED,
  RESOURCE_UPDATE_REQUESTED,
} from './actionTypes';

import {
  maybeThrowSubmissionError,
  notFoundError,
  rejectWithUnless,
  responseHasOneRecord,
} from './actionUtils';

const { forOwn, isEqual, pick } = lodash;

export function addEntities(entities) {
  return {
    type: ENTITIES_ADDED,
    payload: {
      data: entities,
    },
  };
}

export function removeEntities({ type }) {
  return {
    type: ENTITIES_REMOVED,
    payload: {
      data: {
        type,
      },
    },
  };
}

export function removeEntity(entity) {
  return {
    type: ENTITY_REMOVED,
    payload: {
      data: entity,
    },
  };
}

export function patchMeta(entity, patches) {
  return {
    type: PATCH_META,
    payload: {
      data: {
        id: entity.id,
        type: entity.type,
        meta: patches,
      },
    },
  };
}

export function loadRelationshipLinkageData({ source, relationName }) {
  const url = source.relationships[relationName].links.self;
  return {
    type: LINKAGE_DATA_REQUESTED,
    meta: {
      apiRequest: {
        config: {
          url,
        },
      },
      entity: source,
      relationName,
    },
  };
}

export function loadRelationship({
  source,
  relationName,
  params,
  apiRequestMeta={},
}) {
  const url = source.relationships[relationName].links.related;
  return {
    type: RELATION_REQUESTED,
    meta: {
      apiRequest: {
        ...apiRequestMeta,
        config: {
          url,
          params,
        },
      },
      entity: source,
      relationName,
    },
  };
}

export function loadRelationshipAndLinkageData({
  source,
  relationName,
  params,
  apiRequestMeta,
}) {
  return (dispatch) => {
    const loadRelationshipAction = loadRelationship({
      source,
      relationName,
      params,
      apiRequestMeta,
    });
    const loadLinkageDataAction = loadRelationshipLinkageData({
      source,
      relationName,
    });

    return dispatch(loadRelationshipAction)
      .then(() => dispatch(loadLinkageDataAction));
  };
}


function adjustRelationsAction({ method, type, source, relations, relationName }) {
  return (dispatch) => {
    const url = source.relationships[relationName].links.self;
    const action = {
      type,
      meta: {
        apiRequest: {
          config: {
            method,
            url,
            headers: {
              'content-type': 'application/vnd.api+json',
            },
            data: {
              data: relations.map(relation => ({
                type: relation.type,
                id: relation.id,
              })),
            },
          },
        },
      },
    };

    return dispatch(action)
      .then((response) => {
        dispatch(loadRelationshipLinkageData({ source, relationName }));
        return response;
      })
      .catch(maybeThrowSubmissionError);
  };
}


export function addRelations({ source, relations, relationName = relations[0].type }) {
  return adjustRelationsAction({
    source,
    relations,
    relationName,
    method: 'post',
    type: RELATIONS_ADDED,
  });
}


export function deleteRelations({ source, relations, relationName = relations[0].type }) {
  return adjustRelationsAction({
    source,
    relations,
    relationName,
    method: 'delete',
    type: RELATIONS_REMOVED,
  });
}

export function loadResource(resource, params) {
  return {
    type: RESOURCE_REQUESTED,
    meta: {
      apiRequest: {
        config: {
          params,
          url: resource.links.self,
        },
      },
      entity: resource,
    },
  };
}

// Load a single resource by lookup key (not primary key).
//
// Usually, a single resource would be loaded with its primary key.  However,
// sometimes we wish to use another attribute.  Examples might include a
// tenant's identifier or a launch token's name.
//
// JSONAPI does not provide a means for us to do so directly.  However, we can
// load a list of resources and add a filter to limit the resources included.
//
// To better simulate loading a single resource, this action will return a 404
// error if the response does not contain exactly one resource.
//
export function loadResourceByLookupKey(url, resource, key, value, params={}) {
  return (dispatch) => {
    const filterParams = {
      [`filter[${key}]`]: value,
    };
    const initialAction = {
      type: RESOURCE_REQUESTED,
      meta: {
        apiRequest: {
          config: {
            params: { ...params, ...filterParams },
            url: url,
          },
          options: {
            onSuccess: rejectWithUnless(notFoundError, responseHasOneRecord),
          },
        },
        entity: resource,
        lookup: {
          key,
          value,
        }
      },
    };

    return dispatch(initialAction)
      .then((responseAction) => {
        if (responseAction.type === apiRequest.rejected(initialAction.type)) {
          return Promise.reject(responseAction);
        }
        return responseAction;
      });
  };
}

export function createResource(resource, params, apiRequestMeta={}) {
  return (dispatch) => {
    const action = {
      type: RESOURCE_CREATION_REQUESTED,
      meta: {
        apiRequest: {
          ...apiRequestMeta,
          config: {
            params,
            method: 'post',
            url: resource.links.self,
            headers: {
              'content-type': 'application/vnd.api+json',
            },
            data: {
              data: {
                type: resource.type,
                id: resource.id,
                attributes: resource.attributes,
                relationships: resource.relationships,
              },
            },
          },
        },
      },
    };

    return dispatch(action)
      .catch(maybeThrowSubmissionError);
  };
}

function attributesToPatch(resource, attributePatches) {
  let updatableAttributePatches = attributePatches;

  // Remove any attributes that we can't update.
  if (resource.meta.updatableFields) {
    invariant(
      Array.isArray,
      'resource.meta.updatableFields must be null or an array. Got %s',
      resource.meta.updatableFields,
    );
    updatableAttributePatches = pick(attributePatches, resource.meta.updatableFields);
  }

  // Remove any attributes that haven't changed.
  const patches = {};
  forOwn(updatableAttributePatches, (value, key) => {
    if (Object.prototype.hasOwnProperty.call(resource.attributes, key)) {
      if (resource.id != null && isEqual(resource.attributes[key], value)) {
        console.debug(`Skipping unchanged attribute ${key}`);  // eslint-disable-line no-console
      } else {
        patches[key] = value;
      }
    }
  });

  return patches;
}


export function updateResource({ resource, attributePatches }) {
  // Once the request has been successfully processed, the redux store will be
  // updated with the new attributes.  Any relationship data is
  // not touched.
  //
  // That could be changed, by taking another parameter (perhaps `params`) and
  // using it to specify which resources to include and which fields to
  // include for them.
  return (dispatch) => {
    const fields = Object.keys(resource.attributes);

    const action = {
      type: RESOURCE_UPDATE_REQUESTED,
      meta: {
        apiRequest: {
          config: {
            params: {
              [`fields[${resource.type}]`]: fields.join(','),
            },
            method: 'patch',
            url: resource.links.self,
            headers: {
              'content-type': 'application/vnd.api+json',
            },
            data: {
              data: {
                type: resource.type,
                id: resource.id,
                attributes: attributesToPatch(resource, attributePatches),
              },
            },
          },
        },
      },
    };

    return dispatch(action)
      .catch(maybeThrowSubmissionError);
  };
}

export function deleteResource({ resource }) {
  return {
    type: RESOURCE_DELETION_REQUESTED,
    meta: {
      apiRequest: {
        config: {
          method: 'delete',
          url: resource.links.self,
        },
      },
      entity: resource,
    },
  };
}
