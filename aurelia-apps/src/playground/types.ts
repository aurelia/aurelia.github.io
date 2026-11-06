export interface PlaygroundFile {
  name: string;
  content: string;
}

export interface PlaygroundExample {
  id: string;
  title: string;
  description: string;
  open: string | null;
  files: PlaygroundFile[];
}

/** Messages the preview iframe posts back to the playground. */
export type PreviewMessage =
  | { source: 'au-playground'; run: number; type: 'console'; level: 'log' | 'info' | 'warn' | 'error' | 'debug'; args: string[] }
  | { source: 'au-playground'; run: number; type: 'error'; message: string; stack?: string }
  | { source: 'au-playground'; run: number; type: 'ready' };
