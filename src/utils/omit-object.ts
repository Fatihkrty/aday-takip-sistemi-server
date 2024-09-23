export default function omitObject<T, K extends (keyof T)[]>(
  obj: T,
  ...keys: K
): Omit<T, K[number]> {
  keys.forEach((x) => delete obj[x]);
  return obj;
}
