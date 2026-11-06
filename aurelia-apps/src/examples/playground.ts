import { INode, resolve } from 'aurelia';
import { compileFiles } from '../playground/compiler-client';
import type { CompileError, CompileResult } from '../playground/compiler';
import { PlaygroundEditor } from '../playground/editor';
import { PreviewFrame, aureliaVersion, loadRuntime } from '../playground/preview';
import { decodeState, encodeState } from '../playground/share';
import type { PlaygroundExample, PlaygroundFile, PreviewMessage } from '../playground/types';

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  id: number;
  level: LogLevel;
  text: string;
}

interface Problem {
  title: string;
  detail: string;
}

const fileName = /^[a-z0-9][a-z0-9._/-]*\.(ts|js|html|css)$/i;
const MAX_LOGS = 300;

/** Reads the examples Hugo rendered into the host element. */
function readExamples(host: HTMLElement): PlaygroundExample[] {
  return [...host.querySelectorAll<HTMLElement>('[data-example]')].map(el => ({
    id: el.dataset.example ?? '',
    title: el.dataset.title ?? '',
    description: el.dataset.description ?? '',
    open: el.dataset.open || null,
    files: [...el.querySelectorAll<HTMLElement>('[data-file]')].map(file => ({
      name: file.dataset.file ?? '',
      content: (file.dataset.content ?? '').replace(/^\r?\n/, '').replace(/\s+$/, '') + '\n',
    })),
  }));
}

/** Script, view and styles of a component sit together; main.ts and index.html go last. */
function sortFiles(files: PlaygroundFile[]): PlaygroundFile[] {
  const group = (name: string) => (/^main\.(ts|js)$/.test(name) ? 1 : name === 'index.html' ? 2 : 0);
  const ext = (name: string) => (/\.(ts|js)$/.test(name) ? 0 : name.endsWith('.html') ? 1 : 2);
  const base = (name: string) => name.replace(/\.[^.]+$/, '');
  return [...files].sort((a, b) =>
    group(a.name) - group(b.name) || base(a.name).localeCompare(base(b.name)) || ext(a.name) - ext(b.name));
}

function starterContent(name: string): string {
  const base = name.split('/').pop()!.replace(/\.[^.]+$/, '');
  const className = base.split(/[-_.]/).filter(Boolean).map(p => p[0].toUpperCase() + p.slice(1)).join('');
  if (name.endsWith('.ts') || name.endsWith('.js')) return `export class ${className} {\n}\n`;
  if (name.endsWith('.html')) return `<p>${base} works</p>\n`;
  return '';
}

export class Playground {
  private readonly host = resolve(INode) as HTMLElement;

  readonly version = aureliaVersion;
  mode: 'page' | 'embed' = 'embed';
  examples: PlaygroundExample[] = [];
  exampleId = '';
  files: PlaygroundFile[] = [];
  activeFile = '';
  logs: LogEntry[] = [];
  problem: Problem | null = null;
  running = false;
  hasRun = false;
  consoleOpen = false;
  addingFile = false;
  newFileName = '';
  newFileError = '';
  shareLabel = 'Copy link';
  playgroundHref = '/playground/';
  dark = false;

  editorHost!: HTMLElement;
  previewHost!: HTMLElement;
  logList?: HTMLElement;
  newFileInput?: HTMLInputElement;

  private editor: PlaygroundEditor | null = null;
  private preview: PreviewFrame | null = null;
  private logId = 0;
  private compileTimer = 0;
  private hashTimer = 0;
  private compileVersion = 0;
  private themeObserver: MutationObserver | null = null;
  private lastHashCode = '';
  private readonly onHashChange = () => void this.loadFromHash();

  get example(): PlaygroundExample | undefined {
    return this.examples.find(e => e.id === this.exampleId);
  }

  get errorCount(): number {
    return this.logs.filter(l => l.level === 'error').length;
  }

  binding(): void {
    this.mode = this.host.dataset.mode === 'page' ? 'page' : 'embed';
    this.examples = readExamples(this.host);
    this.consoleOpen = this.mode === 'page';
    this.dark = document.documentElement.classList.contains('dark');
  }

  async attached(): Promise<void> {
    this.editor = new PlaygroundEditor(this.editorHost, (name, content) => this.onEdit(name, content), this.dark);
    this.preview = new PreviewFrame(this.previewHost, message => this.onPreviewMessage(message));

    this.themeObserver = new MutationObserver(() => {
      this.dark = document.documentElement.classList.contains('dark');
      this.editor?.setDark(this.dark);
    });
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Start fetching the framework while the compiler worker boots.
    void loadRuntime().catch(() => {});

    if (this.mode === 'page') {
      window.addEventListener('hashchange', this.onHashChange);
      if (await this.loadFromHash()) return;
    }
    this.loadExample(this.examples[0]?.id ?? '');
  }

  detaching(): void {
    window.removeEventListener('hashchange', this.onHashChange);
    window.clearTimeout(this.compileTimer);
    window.clearTimeout(this.hashTimer);
    this.themeObserver?.disconnect();
    this.editor?.destroy();
    this.preview?.destroy();
  }

  /** Loads `#code=` or `#example=` from the URL. Returns false when neither applies. */
  private async loadFromHash(): Promise<boolean> {
    const params = new URLSearchParams(location.hash.slice(1));
    const code = params.get('code');
    if (code) {
      if (code === this.lastHashCode) return true;
      const state = await decodeState(code);
      if (state) {
        this.lastHashCode = code;
        this.exampleId = '';
        this.setFiles(state.files, state.open);
        return true;
      }
      this.problem = { title: "Couldn't open this link", detail: 'The shared code in the URL is incomplete or damaged.' };
    }
    const id = params.get('example');
    if (id && this.examples.some(e => e.id === id)) {
      if (id !== this.exampleId || code) this.loadExample(id, false);
      return true;
    }
    return false;
  }

  loadExample(id: string, updateHash = true): void {
    const example = this.examples.find(e => e.id === id) ?? this.examples[0];
    if (!example) return;
    this.exampleId = example.id;
    this.setFiles(example.files, example.open);
    if (this.mode === 'page' && updateHash) {
      this.lastHashCode = '';
      history.replaceState(null, '', `#example=${encodeURIComponent(example.id)}`);
    }
  }

  private setFiles(files: PlaygroundFile[], open: string | null): void {
    this.files = sortFiles(files.map(f => ({ ...f })));
    const first = this.files.find(f => f.name.endsWith('.html') && f.name !== 'index.html') ?? this.files[0];
    this.activeFile = open && this.files.some(f => f.name === open) ? open : first?.name ?? '';
    this.editor?.load(this.files, this.activeFile);
    this.logs = [];
    this.problem = null;
    this.updateShareLinks();
    void this.compileNow();
  }

  openFile(name: string): void {
    if (name === this.activeFile) return;
    this.activeFile = name;
    this.editor?.open(name);
  }

  private onEdit(name: string, content: string): void {
    const file = this.files.find(f => f.name === name);
    if (!file) return;
    file.content = content;
    this.scheduleCompile();
    this.scheduleHashUpdate();
  }

  private scheduleCompile(): void {
    window.clearTimeout(this.compileTimer);
    this.compileTimer = window.setTimeout(() => void this.compileNow(), 450);
  }

  private scheduleHashUpdate(): void {
    window.clearTimeout(this.hashTimer);
    this.hashTimer = window.setTimeout(() => this.updateShareLinks(true), 800);
  }

  /** Keeps the share link (and the page URL, on /playground/) in sync with the code. */
  private async updateShareLinks(writeHash = false): Promise<string> {
    const code = await encodeState(this.files, this.activeFile);
    this.playgroundHref = `/playground/#code=${code}`;
    if (this.mode === 'page' && writeHash) {
      this.lastHashCode = code;
      history.replaceState(null, '', `#code=${code}`);
    }
    return code;
  }

  async compileNow(): Promise<void> {
    const version = ++this.compileVersion;
    this.running = true;
    let result: CompileResult;
    try {
      result = await compileFiles(this.files);
    } catch (error) {
      if (version !== this.compileVersion) return;
      this.running = false;
      this.problem = { title: "The compiler couldn't start", detail: (error as Error).message };
      return;
    }
    if (version !== this.compileVersion) return;

    if (result.errors.length) {
      // Keep the last working preview on screen and point at the problem.
      this.running = false;
      this.problem = { title: 'Syntax error', detail: result.errors.map(formatCompileError).join('\n\n') };
      return;
    }

    this.problem = null;
    this.logs = [];
    try {
      await this.preview?.show(result);
      this.hasRun = true;
    } catch (error) {
      this.problem = { title: "The preview couldn't start", detail: (error as Error).message };
    }
    this.running = false;
  }

  rerun(): void {
    void this.compileNow();
  }

  private onPreviewMessage(message: PreviewMessage): void {
    if (message.type === 'console') {
      this.pushLog(message.level, message.args.join(' '));
    } else if (message.type === 'error') {
      const stack = cleanStack(message.stack, message.message);
      this.pushLog('error', stack ? `${message.message}\n${stack}` : message.message);
      this.problem ??= { title: 'Runtime error', detail: stack ? `${message.message}\n${stack}` : message.message };
    }
  }

  private pushLog(level: LogLevel, text: string): void {
    this.logs.push({ id: ++this.logId, level, text });
    if (this.logs.length > MAX_LOGS) this.logs.splice(0, this.logs.length - MAX_LOGS);
    if (level === 'error' && this.mode === 'embed') this.consoleOpen = true;
    queueMicrotask(() => this.logList?.lastElementChild?.scrollIntoView({ block: 'nearest' }));
  }

  clearLogs(): void {
    this.logs = [];
  }

  toggleConsole(): void {
    this.consoleOpen = !this.consoleOpen;
  }

  dismissProblem(): void {
    this.problem = null;
  }

  async share(): Promise<void> {
    const code = await this.updateShareLinks(true);
    const url = new URL(`/playground/#code=${code}`, location.href).href;
    try {
      await navigator.clipboard.writeText(url);
      this.shareLabel = 'Link copied';
    } catch {
      this.shareLabel = 'Copy failed';
    }
    window.setTimeout(() => (this.shareLabel = 'Copy link'), 2000);
  }

  reset(): void {
    this.loadExample(this.exampleId || this.examples[0]?.id || '');
  }

  startAddFile(): void {
    this.addingFile = true;
    this.newFileName = '';
    this.newFileError = '';
    queueMicrotask(() => this.newFileInput?.focus());
  }

  cancelAddFile(): void {
    this.addingFile = false;
    this.newFileError = '';
  }

  onNewFileKey(event: KeyboardEvent): boolean {
    if (event.key === 'Enter') {
      this.confirmAddFile();
      return false;
    }
    if (event.key === 'Escape') {
      this.cancelAddFile();
      return false;
    }
    return true;
  }

  confirmAddFile(): void {
    const name = this.newFileName.trim();
    if (!name) return this.cancelAddFile();
    if (!fileName.test(name)) {
      this.newFileError = 'Use a .ts, .js, .html or .css name, like my-element.ts';
      return;
    }
    if (this.files.some(f => f.name === name)) {
      this.newFileError = `${name} already exists`;
      return;
    }
    const file = { name, content: starterContent(name) };
    this.files = sortFiles([...this.files, file]);
    this.editor?.add(name, file.content);
    this.addingFile = false;
    this.openFile(name);
    this.scheduleCompile();
    this.scheduleHashUpdate();
  }

  removeFile(name: string, event: Event): void {
    event.stopPropagation();
    if (this.files.length <= 1) return;
    const index = this.files.findIndex(f => f.name === name);
    this.files = this.files.filter(f => f.name !== name);
    this.editor?.remove(name);
    if (this.activeFile === name) {
      const next = this.files[Math.max(0, index - 1)];
      this.activeFile = '';
      this.openFile(next.name);
    }
    this.scheduleCompile();
    this.scheduleHashUpdate();
  }
}

function formatCompileError(error: CompileError): string {
  const where = error.line ? `${error.file}:${error.line}${error.column != null ? `:${error.column + 1}` : ''}` : error.file;
  return `${where}\n${error.message}`;
}

/** Keeps the stack frames that point at playground files, with their real line numbers. */
function cleanStack(stack: string | undefined, message: string): string {
  if (!stack) return '';
  return stack
    .split('\n')
    .filter(line => line.includes('playground:///'))
    // new Function() adds two lines above the module code.
    .map(line => line.replace(/playground:\/\/\/([^\s:)]+):(\d+)(?::(\d+))?/g, (_, file, row, col) =>
      `${file}:${Math.max(1, Number(row) - 2)}${col ? `:${col}` : ''}`))
    .map(line => line.trim())
    .filter(line => line && !line.endsWith(message))
    .join('\n');
}
