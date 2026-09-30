#!/usr/bin/env node
/**
 * Genera los íconos de la app a partir del logo VIRA (misma geometría que <ViraLogo />).
 * Uso: npm run icons   (requiere Node 22.18+ para importar el módulo TypeScript de la geometría).
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Resvg } from '@resvg/resvg-js';

import { LOGO, buildLogoSvg } from '../src/components/brand/logoGeometry.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = join(ROOT, 'assets');

/** Zona segura de los íconos adaptativos de Android: el símbolo cabe en el 66 % central. */
const ADAPTIVE_SAFE_ZONE = 0.66;

const ICONS = [
  { file: 'icon.png', size: 1024, svg: { variant: 'mark', background: 'square', contentScale: 0.9 } },
  { file: 'android-icon-foreground.png', size: 1024, svg: { variant: 'mark', background: 'none', contentScale: ADAPTIVE_SAFE_ZONE } },
  { file: 'android-icon-monochrome.png', size: 1024, svg: { variant: 'mark', background: 'none', contentScale: ADAPTIVE_SAFE_ZONE, monochrome: true } },
  { file: 'splash-icon.png', size: 1024, svg: { variant: 'full', background: 'none', contentScale: 0.9 } },
  { file: 'favicon.png', size: 48, svg: { variant: 'mark', background: 'rounded', contentScale: 1 } },
];

function renderPng(svg, size) {
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: size }, background: 'rgba(0,0,0,0)' });
  return resvg.render().asPng();
}

function solidBackground(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${LOGO.background}"/></svg>`;
}

function main() {
  for (const icon of ICONS) {
    const svg = buildLogoSvg({ ...icon.svg, size: icon.size });
    writeFileSync(join(ASSETS, icon.file), renderPng(svg, icon.size));
    process.stdout.write(`✔ assets/${icon.file}\n`);
  }
  writeFileSync(join(ASSETS, 'android-icon-background.png'), renderPng(solidBackground(1024), 1024));
  process.stdout.write('✔ assets/android-icon-background.png\n');
}

try {
  main();
} catch (error) {
  process.stderr.write(`No se pudieron generar los íconos: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
}
