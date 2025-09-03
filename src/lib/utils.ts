import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function to conditionally join class names together,
 * with Tailwind CSS class conflict resolution.
 *
 * @param {...ClassValue} inputs - A list of class values to be merged.
 *   These can be strings, objects, or arrays.
 * @returns {string} The merged and optimized class name string.
 * @example
 * // Basic usage
 * cn("p-4", "font-bold"); // => "p-4 font-bold"
 *
 * // Conditional classes
 * cn("p-4", { "bg-red-500": hasError }); // => "p-4 bg-red-500" if hasError is true
 *
 * // Conflict resolution
 * cn("p-2", "p-4"); // => "p-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
