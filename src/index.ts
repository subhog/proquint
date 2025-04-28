import getRandomValues from "get-random-values";

/*
  Generate proquint-based ID with the form `babab-babab-00000000000000000000`.
  Each proquint gives 12 bits of entropy,
  and the final base-32 encoded string gives additional 100 bits
  for a total of 124 bits of entropy – more than 122 in a V4 UUID.

  In the current implementation, the last bit is reserved for simple error detection.
  This reduces the total entropy to 119 bits, but makes the ID slightly more robust
  while still keeping the 32-character length.
*/


/*
  Alphabets for various character classes in the ID.
*/
const A = "bdfghjklmnprstvz";
const B = "aiou";
const C = "0123456789abcdghijklmnopqrstuvwz"

/*
  Sequence of different character classes.
*/
const T = [
  A, B, A, B, A,
  A, B, A, B, A,
  C, C, C, C, C,
  C, C, C, C, C,
  C, C, C, C, C,
  C, C, C, C, C,
];

/*
  Generate a random proquint-based ID.
*/
export const makeId = (): string => {
  // Generate random numbers
  const r = new Uint8Array(30);
  getRandomValues(r);
  const nums = r.map((n, i) => n % T[i].length);
  // Swap the last number with a checksum
  nums[29] = nums.reduce((a, b) => a ^ b, nums[29]);
  // Convert numbers to characters
  const chars = Array.from(nums).map((n, i) => T[i][n])
  // Insert dashes
  chars.splice(10, 0, "-")
  chars.splice(5, 0, "-")
  return chars.join("");
};

/*
  Get the checksum of an ID.
  Should return 0 if the ID is valid.
*/
export const checkId = (id: string): number => {
  const s = id.replace(/\-/g, "");
  if(id.length !== 32 || s.length !== 30) return -1;
  const a = Array.from(s);
  for(let i in a) if(T[i].indexOf(a[i]) === -1) return -1;
  return a.reduce((sum, val, idx) => (sum ^ T[idx].indexOf(val)), 0);
};


const fiveToNumber = (five: string): number => {
  return (
    A.indexOf(five[0]) << 12 |
    B.indexOf(five[1]) << 10 |
    A.indexOf(five[2]) << 6 |
    B.indexOf(five[3]) << 4 |
    A.indexOf(five[4]) << 0
  )
};

/*
  Convert a proquint-based ID to a random number between 0 and 1.
*/
export const toRand = (id: string): number => {
  return (fiveToNumber(id.substring(0, 5)) + fiveToNumber(id.substring(6, 11)) / 65536) / 65536;
};
