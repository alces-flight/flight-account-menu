let zxcvbn = null;
export { zxcvbn };

export function loadZxcvbn() {
  return import(/* webpackChunkName: "zxcvbn" */ 'zxcvbn')
    .then(({ default: _zxcvbn }) => {
      zxcvbn = _zxcvbn;
      return zxcvbn;
    });
}
