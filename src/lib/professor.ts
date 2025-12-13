import type { Professor } from '../types/entities';

/**
 * Helper para obtener el nombre del profesor de forma segura
 * Maneja tanto la estructura antigua (con user) como la nueva (sin user)
 */
export function getProfessorName(professor?: Professor): string {
  if (!professor) return 'Instructor no disponible';

  // Nueva estructura de la API (profesor simplificado)
  if (professor.name && professor.surname) {
    return `${professor.name} ${professor.surname}`;
  }

  // Estructura antigua (con user anidado)
  if (professor.user?.name && professor.user?.surname) {
    return `${professor.user.name} ${professor.user.surname}`;
  }

  return 'Instructor';
}

/**
 * Helper para obtener la foto de perfil del profesor
 */
export function getProfessorProfilePicture(
  professor?: Professor
): string | undefined {
  if (!professor) return undefined;

  // Nueva estructura
  if (professor.profilePicture) {
    return professor.profilePicture;
  }

  // Estructura antigua
  if (professor.user?.profile_picture) {
    return professor.user.profile_picture;
  }

  return undefined;
}

/**
 * Helper para obtener el email del profesor (solo en contextos donde se tiene acceso)
 */
export function getProfessorEmail(professor?: Professor): string | undefined {
  if (!professor) return undefined;

  // Solo disponible en estructura completa
  return professor.user?.mail;
}

/**
 * Helper para obtener las iniciales del profesor para avatares
 */
export function getProfessorInitials(professor?: Professor): string {
  if (!professor) return '?';

  let firstName = '';
  let lastName = '';

  if (professor.name && professor.surname) {
    firstName = professor.name;
    lastName = professor.surname;
  } else if (professor.user?.name && professor.user?.surname) {
    firstName = professor.user.name;
    lastName = professor.user.surname;
  }

  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();

  return firstInitial + lastInitial || '?';
}
