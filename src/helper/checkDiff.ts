export function integerDiff(a: number | string, b: number | string) {
  const numberizeA = Number(a);
  const numberizeB = Number(b);

  if (isNaN(numberizeA) || isNaN(numberizeB)) {
    return null;
  }

  return Math.abs(Math.floor(numberizeA - numberizeB));
}
