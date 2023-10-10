export function isTrue(value: unknown): value is true {
  return value === true;
}

export function isNotTrue(value: unknown) {
  return !isTrue(value);
}
