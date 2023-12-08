import * as mongoose from 'mongoose';

export const MATH_SERVICE = 'MATH_SERVICE';

export const ObjectId = mongoose.Types.ObjectId;

export function mapFromArray<T>(
  array: T[],
  keyStrategy: (v: T) => string | number,
) {
  const map: Record<string | number, T | undefined> = {};

  for (const item of array) {
    map[keyStrategy(item)] = item;
  }

  return map;
}
