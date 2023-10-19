export function getPageNumbers(length: number) {
  return Array.from({ length }, (_, i) => i + 1);
}

export function calculateTotalPages(total: number, size: number) {
  return Math.ceil(total / size);
}
