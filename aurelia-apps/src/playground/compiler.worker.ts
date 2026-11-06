import * as Babel from '@babel/standalone';
import { compile } from './compiler';
import type { PlaygroundFile } from './types';

interface CompileRequest {
  id: number;
  files: PlaygroundFile[];
}

self.addEventListener('message', (event: MessageEvent<CompileRequest>) => {
  const { id, files } = event.data;
  try {
    self.postMessage({ id, result: compile(Babel, files) });
  } catch (error) {
    self.postMessage({ id, error: error instanceof Error ? error.message : String(error) });
  }
});
