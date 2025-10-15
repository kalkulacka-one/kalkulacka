export function stringHash(input: string) {
  let hash = 0;
  const p = 31;
  const HASH_MODULUS = 1000000007;
  let pPow = 1;

  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    hash = (hash + charCode * pPow) % HASH_MODULUS;
    pPow = (pPow * p) % HASH_MODULUS;
  }
  return hash;
}
