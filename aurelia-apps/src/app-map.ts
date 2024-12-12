const modules = import.meta.glob('./examples/*.ts');

export const appMap = Object.fromEntries(
  Object.entries(modules).map(([path, importFn]) => [
    path.match(/\.\/examples\/(.+)\.ts$/)?.[1] ?? '',
    () => importFn().then(m => (m as any).default ?? Object.values(m)[0])
  ])
);
