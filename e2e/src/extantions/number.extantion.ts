interface Number {
  toPad(size: number): string;
  toRegexp(size: number): string;
}

// @ts-ignore
Number.prototype.toPad = function (size: number) {
  const _self = this;
  let result = _self + '';
  while (result.length < size) {
    result = '0' + result;
  }
  return result;
};

// @ts-ignore
Number.prototype.toRegexp = function (size: number) {
  const _self = this;
  let result = _self + '';
  let i = size - result.length;
  while (i > 0) {
    result = result + '\\d';
    i--;
  }
  return result;
};


