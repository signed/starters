export const getOrInsert = <Key, Value>(map: Map<Key, Value>, key: Key, creator: (key: Key) => Value): Value => {
  if (!map.has(key)) {
    const value = creator(key);
    map.set(key, value);
    return value;
  }
  return map.get(key)!;
};
