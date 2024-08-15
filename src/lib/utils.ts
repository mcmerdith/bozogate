import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Roll hidden dice without knowing the internal state
 * @param numDice The number of dice to roll
 * @param numSides The number of sides on each die
 * @param offset An offset to add to the result
 * @returns The result of the roll
 */
export function rollHiddenDice(
  numDice: number,
  numSides: number,
  offset = 0,
  options?:
    | { advantage: true; disadvantage?: false }
    | { advantage?: false; disadvantage: true },
): number {
  let roll = rollDice(numDice, numSides);

  if (options?.disadvantage) {
    roll = Math.min(roll, rollDice(numDice, numSides));
  } else if (options?.advantage) {
    roll = Math.max(roll, rollDice(numDice, numSides));
  }

  return roll + offset;
}

/**
 * Roll some dice
 * @param numDice The number of dice to roll
 * @param numSides The number of sides on each die
 * @returns The result of the roll
 */
export function rollDice(numDice: number, numSides: number): number {
  return new Array(numDice)
    .fill(0)
    .map(() => rollDie(numSides))
    .reduce((prev, curr) => prev + curr);
}

/**
 * Roll a single die
 * @param numSides The number of sides on the die
 * @returns The result of the roll
 */
export function rollDie(numSides: number): number {
  return Math.floor(Math.random() * numSides) + 1;
}
