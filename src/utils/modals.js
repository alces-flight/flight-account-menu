import lodash from 'lodash';
const get = lodash.get;

function skipMetaEtc(meta) {
  const isApiResponse = get(meta, 'previousAction.meta.apiRequest') != null;
  return isApiResponse;
}

export function createModalReducer(shownType, hiddenTypes) {
  const initialState = { modalIsShowing: false };
  if (!Array.isArray(hiddenTypes)) {
    hiddenTypes = [hiddenTypes];
  }

  return function(state=initialState, { type, error, meta, payload }) {
    if (type === shownType) {
      if (skipMetaEtc(meta)) {
        return {
          modalIsShowing: true,
        };
      } else {
        return {
          modalIsShowing: true,
          error,
          payload,
          meta,
        };
      }
    }
    if (hiddenTypes.includes(type)) {
      if (skipMetaEtc(meta)) {
        return {
          modalIsShowing: false,
        };
      } else {
        return {
          modalIsShowing: false,
          error,
          payload,
          meta,
        };
      }
    }
    return state;
  };
};

export function createModalSelector(...args) {
  const getModalData = createModalDataSelector(...args);
  return function(state) {
    const md = getModalData(state);
    if (md == null) { return false; }
    return md.modalIsShowing;
  };
}

export function createModalDataSelector(...args) {
  return function(state) {
    const data = get(state, args);
    return data == null ? {} : data;
  };
}
