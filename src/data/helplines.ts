/**
 * Líneas de ayuda en crisis. Editables por país; Perú por defecto.
 * Verificadas el 2026-09-29 en fuentes oficiales:
 * - Línea 113 opción 5 (salud mental, MINSA, gratuita, 24 h; WhatsApp 955 557 000):
 *   https://www.gob.pe/institucion/minsa/noticias/1332478-minsa-recuerda-que-la-linea-113-brinda-orientacion-y-apoyo-psicologico-gratuito-las-24-horas
 * - SAMU 106 (emergencias médicas): https://www.gob.pe/1013-solicitar-atencion-medica-en-caso-de-emergencia-samu
 * - PNP 105 y Línea 100 (violencia familiar o sexual): https://www.gob.pe/547-telefonos-de-emergencia
 */

export interface Helpline {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  /** Número para marcar (solo dígitos). */
  readonly phone: string;
  /** Texto que se muestra (p. ej. "113, opción 5"). */
  readonly display: string;
  readonly whatsapp?: string;
  readonly source: string;
}

export interface CountryHelplines {
  readonly country: string;
  readonly helplines: readonly Helpline[];
}

export const PERU_HELPLINES: CountryHelplines = {
  country: 'Perú',
  helplines: [
    {
      id: 'minsa-113',
      name: 'Línea 113 · Salud mental',
      description: 'Orientación y apoyo psicológico gratuito, las 24 horas.',
      phone: '113',
      display: '113, opción 5',
      whatsapp: '51955557000',
      source: 'https://www.gob.pe/555-recibir-informacion-y-orientacion-en-salud',
    },
    {
      id: 'samu-106',
      name: 'SAMU · Emergencias médicas',
      description: 'Si tú o alguien está en peligro inmediato.',
      phone: '106',
      display: '106',
      source: 'https://www.gob.pe/1013-solicitar-atencion-medica-en-caso-de-emergencia-samu',
    },
    {
      id: 'pnp-105',
      name: 'Policía Nacional',
      description: 'Emergencias y situaciones de riesgo.',
      phone: '105',
      display: '105',
      source: 'https://www.gob.pe/547-telefonos-de-emergencia',
    },
    {
      id: 'linea-100',
      name: 'Línea 100',
      description: 'Ante violencia familiar o sexual, gratuita y 24 horas.',
      phone: '100',
      display: '100',
      source: 'https://www.gob.pe/547-telefonos-de-emergencia',
    },
  ],
};

export const DEFAULT_HELPLINES = PERU_HELPLINES;
