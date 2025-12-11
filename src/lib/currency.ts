/**
 * Utilidades para manejo de moneda y conversión entre pesos y centavos
 */

/**
 * Convierte una cantidad en pesos a centavos
 * @param amount - Cantidad en pesos (ej: 100.50)
 * @returns Cantidad en centavos (ej: 10050)
 */
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Convierte una cantidad en centavos a pesos
 * @param cents - Cantidad en centavos (ej: 10050)
 * @returns Cantidad en pesos (ej: 100.50)
 */
export function toAmount(cents: number): number {
  return cents / 100;
}

/**
 * Formatea una cantidad en centavos como moneda local
 * @param cents - Cantidad en centavos
 * @param locale - Código de localización (por defecto 'es-AR')
 * @param currency - Código de moneda (por defecto 'ARS')
 * @returns String formateado (ej: "$100,50")
 */
export function formatCurrency(
  cents: number,
  locale: string = 'es-AR',
  currency: string = 'ARS'
): string {
  const amount = toAmount(cents);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Valida que un precio en pesos sea válido
 * @param price - Precio en pesos
 * @returns true si el precio es válido
 */
export function validatePrice(price: number): boolean {
  if (price < 0) return false;
  if (price > 999999.99) return false; // Límite razonable
  if (!Number.isFinite(price)) return false;
  return true;
}
