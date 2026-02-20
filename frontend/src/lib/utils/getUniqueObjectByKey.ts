export const getUniqueObjectArrayByKey = <T, K extends keyof T>(array: T[], key: K): T[] => {
  const map = new Map<T[K], T>();

  for (const item of array) {
    if (!map.has(item[key])) {
      map.set(item[key], item);
    }
  }
  return Array.from(map.values());
};
