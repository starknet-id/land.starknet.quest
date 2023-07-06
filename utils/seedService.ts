class XorShift {
  private state: number;

  constructor(seed: number) {
    this.state = seed || 0x87654321;
  }

  // Xorshift algorithm
  public nextInt(): number {
    this.state ^= this.state << 13;
    this.state ^= this.state >>> 17;
    this.state ^= this.state << 5;
    return this.state & ((1 << 30) - 1); // Only return the lower 30 bits
  }

  // Generate a float between 0 (inclusive) and 1 (exclusive)
  public nextFloat(): number {
    let rand;
    do {
      rand = this.nextInt() / (1 << 30);
    } while (rand < 0.1); // Adjust this threshold as needed
    return rand;
  }
}

// Hashes a large hexadecimal seed to a smaller size
function hashSeed(seed: string): number {
  let hash = 0;

  for (let i = 0; i < seed.length; i += 2) {
    let piece = seed.slice(i, i + 2); // Slice into pieces of 2 characters
    let pieceInt = parseInt(piece, 16); // Convert each piece into an integer

    hash ^= pieceInt; // Combine piece into hash using XOR
  }

  return hash;
}

// Converts a hexadecimal seed to an integer and initializes the Xorshift PRNG
export function seedRandom(seed: string): XorShift {
  const hashedSeed = hashSeed(seed);
  return new XorShift(hashedSeed);
}
