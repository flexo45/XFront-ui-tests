interface Date {
  toPostgrePatternString(): string;
}


import './number.extantion';
// @ts-ignore
Date.prototype.toPostgrePatternString = function () {
  const _self = this;
  return `${_self.getUTCFullYear()}-${(_self.getUTCMonth() + 1).toPad(2)}-${_self.getUTCDate().toPad(2)}T` +
    `${_self.getUTCHours().toPad(2)}:${_self.getUTCMinutes().toPad(2)}:${_self.getUTCSeconds().toPad(2)}\\.` +
    `\\d{3,6}\\+00:00`;
};
