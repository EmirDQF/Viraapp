/** Tipos del usuario y de la racha diaria. */

export interface User {
  readonly name: string;
  /** Fecha de nacimiento ISO (yyyy-mm-dd). */
  readonly birthDate: string;
  /** Marca de tiempo ISO de creación del perfil. */
  readonly createdAt: string;
}

export interface Streak {
  readonly count: number;
  /** Último día con actividad (yyyy-mm-dd) o null si nunca hubo actividad. */
  readonly lastActiveDate: string | null;
}
