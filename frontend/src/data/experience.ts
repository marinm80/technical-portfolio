import type { Experience } from "../types";

// SECCIÓN OCULTA: la página Experience está desconectada del router (App.tsx)
// hasta tener trayectoria real. Este data file, los textos en locales/ y la
// página siguen listos para reactivarla.
// TODO(rafael): contenido placeholder — reemplazar con experiencia laboral real.
// Los textos (rol, empresa, periodo, logros) viven en src/locales/{es,en}.ts
// bajo experience.items.<id>.
export const experiences: Experience[] = [{ id: "techcorp" }, { id: "startup" }];
