export function cloneObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
