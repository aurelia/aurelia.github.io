import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// aurelia's package.json isn't exported, so read it from disk.
const pkgPath = fileURLToPath(new URL('../node_modules/aurelia/package.json', import.meta.url));

export const aureliaVersion: string = JSON.parse(readFileSync(pkgPath, 'utf8')).version;
export const runtimeFileName = `playground/aurelia-${aureliaVersion}.js`;
