import type { CompileResult } from './compiler';
import type { PreviewMessage } from './types';

declare const __PLAYGROUND_RUNTIME__: string;
declare const __AURELIA_VERSION__: string;

export const aureliaVersion = __AURELIA_VERSION__;

// The framework bundle sits next to the built chunks in /aurelia2/.
const chunkUrl = import.meta.url;
const runtimeUrl = new URL(__PLAYGROUND_RUNTIME__, chunkUrl).href;

let runtimeCode: Promise<string> | null = null;

export function loadRuntime(): Promise<string> {
  runtimeCode ??= fetch(runtimeUrl).then(response => {
    if (!response.ok) throw new Error(`Couldn't load Aurelia (${response.status})`);
    return response.text();
  });
  runtimeCode.catch(() => (runtimeCode = null));
  return runtimeCode;
}

// JSON with `<` escaped can sit inside an inline <script> safely.
const jsonForScript = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');

/** Runs first in the preview: forwards console output and errors to the playground. */
function bridge(run: number) {
  return `(() => {
  const RUN = ${run};
  const send = message => parent.postMessage(Object.assign({ source: 'au-playground', run: RUN }, message), '*');
  const format = (value, depth = 0, seen = new WeakSet()) => {
    if (typeof value === 'string') return depth ? JSON.stringify(value) : value;
    if (value instanceof Error) return value.stack && depth === 0 ? value.stack : value.name + ': ' + value.message;
    if (typeof value === 'function') return value.name ? '[Function ' + value.name + ']' : '[Function]';
    if (typeof value === 'symbol' || typeof value === 'bigint') return String(value);
    if (value === null || typeof value !== 'object') return String(value);
    if (typeof Node !== 'undefined' && value instanceof Node) return '<' + (value.nodeName || 'node').toLowerCase() + '>';
    if (seen.has(value)) return '[Circular]';
    if (depth > 3) return Array.isArray(value) ? '[Array]' : '[Object]';
    seen.add(value);
    if (Array.isArray(value)) return '[' + value.map(v => format(v, depth + 1, seen)).join(', ') + ']';
    const name = value.constructor && value.constructor !== Object ? value.constructor.name + ' ' : '';
    const entries = Object.keys(value).slice(0, 50).map(k => k + ': ' + format(value[k], depth + 1, seen));
    return name + '{ ' + entries.join(', ') + (entries.length ? ' }' : '}');
  };
  for (const level of ['log', 'info', 'warn', 'error', 'debug']) {
    const original = console[level].bind(console);
    console[level] = (...args) => {
      try { send({ type: 'console', level, args: args.map(a => format(a)) }); } catch {}
      original(...args);
    };
  }
  const report = error => send({
    type: 'error',
    message: error && error.message ? error.message : String(error),
    stack: error && error.stack ? String(error.stack) : undefined,
  });
  window.__reportPlaygroundError = report;
  // The playground can flip the preview between light and dark without a rerun.
  addEventListener('message', event => {
    const data = event.data;
    if (event.source !== parent || !data || data.source !== 'au-playground-host') return;
    if (data.type === 'theme') document.documentElement.dataset.theme = data.theme;
  });
  addEventListener('error', event => report(event.error || event.message));
  addEventListener('unhandledrejection', event => report(event.reason));
})();`;
}

/** A tiny CommonJS loader over the compiled modules. */
function loader(result: CompileResult) {
  const modules = Object.fromEntries(result.modules.map(m => [m.name, m.code]));
  return `(() => {
  const sources = ${jsonForScript(modules)};
  const entry = ${jsonForScript(result.entry)};
  const root = ${jsonForScript(result.root)};
  const runtime = window.__AURELIA_PLAYGROUND__;
  const report = window.__reportPlaygroundError;
  const cache = Object.create(null);

  const resolve = (from, spec) => {
    const parts = spec.startsWith('/') ? [] : from.split('/').slice(0, -1);
    for (const part of spec.split('/')) {
      if (part === '..') parts.pop();
      else if (part && part !== '.') parts.push(part);
    }
    const path = parts.join('/');
    for (const candidate of [path, path + '.ts', path + '.js', path + '/index.ts', path + '/index.js']) {
      if (candidate in sources) return candidate;
    }
    throw new Error('Cannot find "' + spec + '" (imported from ' + from + ')');
  };

  const requireFrom = from => spec => {
    if (spec.endsWith('.css')) return {};
    if (!spec.startsWith('.') && !spec.startsWith('/')) {
      if (spec in runtime.modules) return runtime.modules[spec];
      throw new Error('"' + spec + '" isn\\'t available in the playground. You can import from: ' + Object.keys(runtime.modules).join(', ') + '.');
    }
    return load(resolve(from, spec));
  };

  const load = name => {
    if (cache[name]) return cache[name].exports;
    const module = cache[name] = { exports: {} };
    const fn = new Function('require', 'module', 'exports', sources[name] + '\\n//# sourceURL=playground:///' + name);
    fn(requireFrom(name), module, module.exports);
    return module.exports;
  };

  try {
    if (entry) {
      load(entry);
    } else if (root) {
      const { Aurelia, CustomElement } = runtime.modules.aurelia;
      const exported = load(root);
      const component = Object.values(exported).find(value => CustomElement.isType(value));
      if (!component) throw new Error('No component found in ' + root + '. Export a class or add a main.ts.');
      const name = CustomElement.getDefinition(component).name;
      const host = document.querySelector(name) || document.body.appendChild(document.createElement(name));
      Promise.resolve(new Aurelia().app({ host, component }).start()).catch(report);
    } else {
      throw new Error('Nothing to run. Add a main.ts or a component.');
    }
  } catch (error) {
    report(error);
  }
})();`;
}

// Example CSS can use light-dark() to follow the preview theme.
const baseStyles = `
  :root { color-scheme: light; }
  :root[data-theme="dark"] { color-scheme: dark; }
  body {
    margin: 0;
    padding: 16px;
    font: 16px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif;
    color: light-dark(#1f2328, #ece6ee);
    background: light-dark(#fff, #17131a);
  }
`;

export type PreviewTheme = 'light' | 'dark';

export function buildDocument(result: CompileResult, runtime: string, run: number, theme: PreviewTheme = 'light'): string {
  const styles = result.css.map(file => `<style data-file="${file.name.replace(/"/g, '')}">${file.code.replace(/<\/style/gi, '<\\/style')}</style>`);

  return `<!doctype html>
<html lang="en" data-theme="${theme}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${baseStyles}</style>
${styles.join('\n')}
<script>${bridge(run)}</script>
<script>(0, eval)(${jsonForScript(runtime + '\n//# sourceURL=aurelia.js')});</script>
</head>
<body>
${result.bodyHtml ?? ''}
<script>${loader(result)}</script>
</body>
</html>`;
}

/** Owns the preview iframe. Each run gets a fresh iframe so no state leaks between runs. */
export class PreviewFrame {
  private frame: HTMLIFrameElement | null = null;
  private run = 0;
  private theme: PreviewTheme = 'light';
  private readonly onMessageBound = (event: MessageEvent) => this.onWindowMessage(event);

  constructor(
    private readonly host: HTMLElement,
    private readonly onMessage: (message: PreviewMessage) => void,
  ) {
    window.addEventListener('message', this.onMessageBound);
  }

  async show(result: CompileResult): Promise<number> {
    const runtime = await loadRuntime();
    const run = ++this.run;
    const frame = document.createElement('iframe');
    frame.title = 'Preview';
    // No allow-same-origin: shared code can't touch aurelia.io.
    frame.setAttribute('sandbox', 'allow-scripts allow-modals allow-forms allow-popups');
    frame.srcdoc = buildDocument(result, runtime, run, this.theme);
    this.frame?.remove();
    this.host.prepend(frame);
    this.frame = frame;
    return run;
  }

  setTheme(theme: PreviewTheme): void {
    this.theme = theme;
    this.frame?.contentWindow?.postMessage({ source: 'au-playground-host', type: 'theme', theme }, '*');
  }

  private onWindowMessage(event: MessageEvent): void {
    const data = event.data as PreviewMessage | undefined;
    if (!this.frame || event.source !== this.frame.contentWindow) return;
    if (!data || data.source !== 'au-playground' || data.run !== this.run) return;
    this.onMessage(data);
  }

  destroy(): void {
    window.removeEventListener('message', this.onMessageBound);
    this.frame?.remove();
    this.frame = null;
  }
}
