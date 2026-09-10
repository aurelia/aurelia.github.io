import type { Constructable } from 'aurelia';

const modules = import.meta.glob<Record<string, Constructable>>('./examples/*.ts');

export const appMap = Object.fromEntries(
  Object.entries(modules).map(([path, importFn]) => [
    path.match(/\.\/examples\/(.+)\.ts$/)?.[1] ?? '',
    () => importFn().then(module => module.default ?? Object.values(module)[0]),
  ])
);
