// Turns playground files into CommonJS-style modules the preview can run.
// It mirrors what @aurelia/vite-plugin does at build time: a `foo.ts` file
// with a sibling `foo.html` becomes the `<foo>` custom element, and class
// names ending in ValueConverter, BindingBehavior or CustomAttribute are
// registered as those resource types.

import type { PlaygroundFile } from './types';

export interface CompiledModule {
  name: string;
  code: string;
}

export interface CompileError {
  file: string;
  message: string;
  line?: number;
  column?: number;
}

export interface CompileResult {
  modules: CompiledModule[];
  css: { name: string; code: string }[];
  entry: string | null;
  root: string | null;
  bodyHtml: string | null;
  errors: CompileError[];
}

// Minimal shape of @babel/standalone that the compiler relies on.
export interface BabelLike {
  transform(code: string, options: Record<string, unknown>): { code?: string | null };
}

const scriptExt = /\.(ts|js)$/;

const baseName = (name: string) => name.replace(/\.[^./]+$/, '');
const fileOnly = (name: string) => name.split('/').pop() ?? name;

export const kebabCase = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

const camelCase = (value: string) => value.charAt(0).toLowerCase() + value.slice(1);

export const pascalCase = (value: string) =>
  value
    .split(/[-_\s.]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

const resourceSuffixes = [
  { suffix: 'ValueConverter', kind: 'VC', name: camelCase },
  { suffix: 'BindingBehavior', kind: 'BB', name: camelCase },
  { suffix: 'CustomAttribute', kind: 'CA', name: kebabCase },
] as const;

/**
 * Babel plugin that appends `X.define(...)` calls for undecorated exported
 * classes, following Aurelia's naming conventions.
 */
function conventionsPlugin(fileName: string, htmlPair: string | null) {
  const elementName = kebabCase(fileOnly(baseName(fileName)));
  const expectedClass = pascalCase(fileOnly(baseName(fileName)));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (api: any) => {
    const { template } = api as { template: { statements: { ast(code: string): unknown } } };

    return {
      name: 'aurelia-playground-conventions',
      visitor: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Program(path: any) {
          const body = path.node.body;
          const classes: { name: string; decorated: boolean }[] = [];

          for (const statement of body) {
            const declaration =
              statement.type === 'ExportNamedDeclaration' || statement.type === 'ExportDefaultDeclaration'
                ? statement.declaration
                : null;
            if (!declaration || declaration.type !== 'ClassDeclaration' || !declaration.id) continue;

            const hasStaticAu = declaration.body.body.some(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (member: any) => member.static && member.key?.name === '$au',
            );
            const decorated = (declaration.decorators?.length ?? 0) > 0 || hasStaticAu;
            classes.push({ name: declaration.id.name, decorated });
          }

          // Plain require() calls, so TypeScript's import elision can't drop them.
          const statements: string[] = [];
          const resources: string[] = [];
          const plain: string[] = [];

          for (const cls of classes) {
            if (cls.decorated) continue;

            const resource = resourceSuffixes.find(r => cls.name.endsWith(r.suffix) && cls.name !== r.suffix);
            if (resource) {
              const name = resource.name(cls.name.slice(0, -resource.suffix.length));
              const api = { VC: 'ValueConverter', BB: 'BindingBehavior', CA: 'CustomAttribute' }[resource.kind];
              statements.push(`require("aurelia").${api}.define(${JSON.stringify(name)}, ${cls.name});`);
              resources.push(cls.name);
            } else {
              plain.push(cls.name);
            }
          }

          const element = htmlPair ? plain.find(name => name === expectedClass) ?? (plain.length === 1 ? plain[0] : null) : null;
          if (element) {
            // Resources declared next to an element are available in its view.
            const view = `require(${JSON.stringify('./' + fileOnly(htmlPair as string))}).definition`;
            statements.push(
              `require("aurelia").CustomElement.define({ ...${view}, name: ${JSON.stringify(elementName)}, ` +
                `dependencies: [...${view}.dependencies, ${resources.join(', ')}] }, ${element});`,
            );
          }

          if (statements.length === 0) return;
          path.pushContainer('body', template.statements.ast(statements.join('\n')));
        },
      },
    };
  };
}

interface HtmlMeta {
  template: string;
  dependencies: string[];
  bindables: Record<string, { mode?: string; attribute?: string }>;
  containerless: boolean;
  shadow: boolean;
}

/** Pulls the convention tags (`<import>`, `<bindable>` and friends) out of a template. */
function parseHtml(source: string): HtmlMeta {
  const dependencies: string[] = [];
  const bindables: HtmlMeta['bindables'] = {};
  let containerless = false;
  let shadow = false;

  let template = source.replace(/<(import|require)\s+from\s*=\s*["']([^"']+)["']\s*\/?>(\s*<\/\1>)?/gi, (_, _tag, from) => {
    dependencies.push(from);
    return '';
  });

  template = template.replace(/<bindable\s+([^>]*?)\/?>(\s*<\/bindable>)?/gi, (_, attrs: string) => {
    const read = (attr: string) => attrs.match(new RegExp(`${attr}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1];
    const names = read('name') ?? read('property');
    for (const name of (names ?? '').split(',').map(n => n.trim()).filter(Boolean)) {
      const mode = read('mode');
      const attribute = read('attribute');
      bindables[name] = { ...(mode ? { mode } : {}), ...(attribute ? { attribute } : {}) };
    }
    return '';
  });

  template = template.replace(/<containerless\s*\/?>(\s*<\/containerless>)?/gi, () => {
    containerless = true;
    return '';
  });

  template = template.replace(/<use-shadow-dom[^>]*\/?>(\s*<\/use-shadow-dom>)?/gi, () => {
    shadow = true;
    return '';
  });

  return { template: template.trim(), dependencies, bindables, containerless, shadow };
}

function compileHtml(file: PlaygroundFile, files: Map<string, PlaygroundFile>, hasScriptPair: boolean): string {
  const meta = parseHtml(file.content);
  const dir = file.name.includes('/') ? file.name.slice(0, file.name.lastIndexOf('/') + 1) : '';

  const deps = meta.dependencies.map(from => {
    // `<import from="./child.html">` should load the element, not the raw view.
    if (from.endsWith('.html')) {
      const target = normalize(dir + from.replace(/^\.\//, ''));
      const script = [...files.keys()].find(n => scriptExt.test(n) && baseName(n) === baseName(target));
      if (script) return from.replace(/\.html$/, '');
    }
    return from;
  });

  const definition = [
    `template: ${JSON.stringify(meta.template)}`,
    `dependencies: [${deps.map(d => `require(${JSON.stringify(d)})`).join(', ')}]`,
    Object.keys(meta.bindables).length ? `bindables: ${JSON.stringify(meta.bindables)}` : '',
    meta.containerless ? 'containerless: true' : '',
    meta.shadow ? `shadowOptions: { mode: 'open' }` : '',
  ].filter(Boolean);

  const lines = [
    `"use strict";`,
    `Object.defineProperty(exports, "__esModule", { value: true });`,
    `exports.definition = { ${definition.join(', ')} };`,
    `exports.template = exports.definition.template;`,
    `exports.default = exports.template;`,
  ];

  if (!hasScriptPair) {
    // HTML-only element: the view is the whole component.
    const name = kebabCase(fileOnly(baseName(file.name)));
    lines.push(
      `const { CustomElement } = require("aurelia");`,
      `exports[${JSON.stringify(pascalCase(name))}] = CustomElement.define({ ...exports.definition, name: ${JSON.stringify(name)} }, class {});`,
    );
  }

  return lines.join('\n');
}

function normalize(path: string): string {
  const out: string[] = [];
  for (const part of path.split('/')) {
    if (part === '..') out.pop();
    else if (part && part !== '.') out.push(part);
  }
  return out.join('/');
}

function babelError(file: string, error: unknown): CompileError {
  const err = error as { message?: string; loc?: { line: number; column: number } };
  const message = (err.message ?? String(error)).replace(/^\/?[^:]+:\s*/, '');
  return { file, message, line: err.loc?.line, column: err.loc?.column };
}

export function compile(babel: BabelLike, input: PlaygroundFile[]): CompileResult {
  const files = new Map(input.map(f => [f.name, f]));
  const result: CompileResult = { modules: [], css: [], entry: null, root: null, bodyHtml: null, errors: [] };

  const pairOf = (name: string, ext: RegExp) =>
    [...files.keys()].find(other => other !== name && ext.test(other) && baseName(other) === baseName(name)) ?? null;

  for (const file of input) {
    if (file.name === 'index.html') {
      const body = file.content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      result.bodyHtml = body ? body[1] : file.content;
      continue;
    }

    if (file.name.endsWith('.css')) {
      result.css.push({ name: file.name, code: file.content });
      continue;
    }

    if (file.name.endsWith('.html')) {
      result.modules.push({ name: file.name, code: compileHtml(file, files, pairOf(file.name, scriptExt) !== null) });
      continue;
    }

    if (scriptExt.test(file.name)) {
      const htmlPair = pairOf(file.name, /\.html$/);
      try {
        const out = babel.transform(file.content, {
          filename: file.name,
          sourceType: 'module',
          retainLines: true,
          plugins: [
            conventionsPlugin(file.name, htmlPair),
            ...(file.name.endsWith('.ts') ? [['transform-typescript', { onlyRemoveTypeImports: false }]] : []),
            ['proposal-decorators', { version: '2023-11' }],
            'transform-modules-commonjs',
          ],
        });
        result.modules.push({ name: file.name, code: out.code ?? '' });
      } catch (error) {
        result.errors.push(babelError(file.name, error));
      }
    }
  }

  result.entry = ['main.ts', 'main.js'].find(n => files.has(n)) ?? null;

  if (!result.entry) {
    // No main file: start the first component, preferring the usual root names.
    const components = input
      .filter(f => scriptExt.test(f.name) && pairOf(f.name, /\.html$/))
      .map(f => f.name);
    result.root =
      ['my-app.ts', 'app.ts', 'my-app.js', 'app.js'].find(n => components.includes(n)) ??
      components[0] ??
      input.find(f => f.name.endsWith('.html') && f.name !== 'index.html')?.name ??
      null;
  }

  return result;
}
