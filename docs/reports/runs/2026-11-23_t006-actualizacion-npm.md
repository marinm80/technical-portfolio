# Informe de sesión · 2026-11-23 · T-006 Actualización de paquetes npm

## Pedido del humano

"Cuando termines quiero que actualices todos los paquetes de npm".

## Criterios

- Rama propia: `task/t-006-npm-update`, creada desde `main` (`62bc65d`). Sin fusionar con `main` y sin push.
- Solo versiones publicadas antes del 2026-11-16 (`--before`), para cumplir el margen de 7 días de la regla de cadena de suministro.
- Una subida mayor por commit. Después de cada paso: `tsc -b`, `eslint .`, `vitest run`, `vite build` y la batería de Playwright.

## Resultado

| Commit | Cambio |
|---|---|
| `34a2162` | Etapa 1: todo lo actualizable dentro de su rango (`npm update --save`). Incluye `react-router` 7.18.5 y `zod` 4.6.7 (cierra T-001). `vitest` y `@vitest/coverage-v8` pasan juntos a 4.1.12. ESLint ignora `coverage/` |
| siguientes | `@emailjs/browser` 4.4.1 → 5.0.3 · `@hookform/resolvers` 5.9.2 → 7.0.6 · `framer-motion` 12.43.0 → 14.14.0 · `i18next` 26.7.2 → 27.1.2 con `react-i18next` 17.1.13 → 18.0.1 · `@testing-library/jest-dom` 6.9.1 → 7.0.1 · `jsdom` 29.1.1 → 31.0.1 · `vitest` y `@vitest/coverage-v8` 4.1.12 → 5.1.0 |

Verificación final después de `npm ci`: `tsc -b` 0, `eslint .` 0, 74/74 unitarios, `vite build` 0, Playwright con 55 que pasan y 1 que se salta. `npm audit --omit=dev`: 0 vulnerabilidades. `npm audit`: un aviso moderado solo de desarrollo (`minimatch` dentro de `typescript-eslint`), cuyo arreglo es posterior al corte. Todas las versiones mayores nuevas admiten Node 22 (`engines`).

## Aplazado (T-007)

- TypeScript 7: `typescript-eslint` 8.72.2 exige TypeScript `>=4.8.4 <6.1.0`. Va en F5 con codemods.
- `@types/node` 26: el runtime es Node 22 (CI y `Dockerfile`).
- Versiones publicadas entre el 17 y el 23 de noviembre (lista en `plan.md`, T-007). Se pueden subir a partir del 2026-11-30.

## Incidencias

- `vitest` se quedaba en 4.1.5 o 4.1.12 porque `@vitest/coverage-v8` exige su misma versión exacta. Instalados por separado, npm rechaza el cambio sin avisar en la salida filtrada. Se instalan siempre juntos.
- `framer-motion` 14: la batería corre con movimiento reducido, así que no verifica la animación de entrada; conviene revisarla a ojo.
- Sin el flag `--no-experimental-webstorage`, los tests unitarios siguen fallando en Node 26 (H1); se resuelve fijando Node 22 en F4.

## Pendiente del humano

1. Revisar la rama `task/t-006-npm-update` y decidir si se fusiona con `main`.
2. Push y despliegue.
