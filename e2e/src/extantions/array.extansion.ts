import {getRandom} from '../utils';

interface Array<T> {
  shuffle(): Array<T>;
  randomElements(count: number): Array<T>;
  randomElement(): T;
  pushRange(items: T[]): number;
}

// @ts-ignore
Array.prototype.shuffle = function() {
  const _self = this;
  for (let i = _self.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [_self[i], _self[j]] = [_self[j], _self[i]];
  }
  return _self;
};
// @ts-ignore
Array.prototype.randomElements = function(count: number = 0) {
  const _self = this;
  const maxRandomElements = (count > _self.length ? _self.length : count);
  const countOfElements = (count === 0 ? getRandom(1, _self.length) : maxRandomElements);
  return _self.shuffle().slice(0, countOfElements);
};
// @ts-ignore
Array.prototype.randomElement = function() {
  const _self = this;
  return _self.shuffle()[0];
};
// @ts-ignore
Array.prototype.pushRange = function(items) {
  const _self = this;
  for (const i of items) {
    _self.push(i);
  }
  return _self.length;
};
