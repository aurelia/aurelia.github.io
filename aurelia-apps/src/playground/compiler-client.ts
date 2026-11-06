import type { CompileResult } from './compiler';
import type { PlaygroundFile } from './types';

// One shared worker for every playground on the page. Babel is large, so
// it's only fetched the first time something needs compiling.
let worker: Worker | null = null;
let nextId = 0;
const pending = new Map<number, { resolve(r: CompileResult): void; reject(e: Error): void }>();

function getWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL('./compiler.worker.ts', import.meta.url), { type: 'module' });
  worker.addEventListener('message', (event: MessageEvent<{ id: number; result?: CompileResult; error?: string }>) => {
    const { id, result, error } = event.data;
    const request = pending.get(id);
    if (!request) return;
    pending.delete(id);
    if (result) request.resolve(result);
    else request.reject(new Error(error ?? 'Compile failed'));
  });
  worker.addEventListener('error', event => {
    for (const request of pending.values()) request.reject(new Error(event.message || 'Compiler failed to load'));
    pending.clear();
    worker = null;
  });
  return worker;
}

export function compileFiles(files: PlaygroundFile[]): Promise<CompileResult> {
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    getWorker().postMessage({ id, files: files.map(f => ({ name: f.name, content: f.content })) });
  });
}
