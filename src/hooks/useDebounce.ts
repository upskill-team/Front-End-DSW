import { useState, useEffect } from 'react';

/**
 * Un hook personalizado que retrasa la actualización de un valor.
 * Es perfecto para implementar "debouncing" en campos de búsqueda.
 *
 * @param value El valor que se quiere "debouncear" (ej: el texto de un input).
 * @param delay El tiempo de espera en milisegundos después de que el usuario deja de teclear.
 * @returns El valor "debounceado" que solo se actualiza después del delay.
 */
export function useDebounce<T>(value: T, delay: number): T {
  // Estado para almacenar el valor "debounceado"
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura un temporizador para actualizar el valor debounced
    // solo después de que haya pasado el tiempo de 'delay'
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Función de limpieza: Se ejecuta si el 'value' cambia antes de que
    // el 'delay' se complete. Esto cancela el temporizador anterior
    // y reinicia el conteo, que es la esencia del debouncing.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Solo se re-ejecuta si el valor o el delay cambian

  return debouncedValue;
}