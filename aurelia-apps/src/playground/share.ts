import type { PlaygroundFile } from './types';

// Playground state lives in the URL hash (`#code=...`) as deflated,
// base64url-encoded JSON, so share links need no server.

interface SharedState {
  v: 1;
  f: [name: string, content: string][];
  o?: string;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array {
  const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function pipe(data: BlobPart, transform: CompressionStream | DecompressionStream): Promise<ArrayBuffer> {
  return new Response(new Blob([data]).stream().pipeThrough(transform)).arrayBuffer();
}

export async function encodeState(files: PlaygroundFile[], open: string | null): Promise<string> {
  const state: SharedState = { v: 1, f: files.map(f => [f.name, f.content]), ...(open ? { o: open } : {}) };
  const compressed = await pipe(JSON.stringify(state), new CompressionStream('deflate-raw'));
  return toBase64Url(new Uint8Array(compressed));
}

export async function decodeState(encoded: string): Promise<{ files: PlaygroundFile[]; open: string | null } | null> {
  try {
    const json = await pipe(fromBase64Url(encoded) as BlobPart, new DecompressionStream('deflate-raw'));
    const state = JSON.parse(new TextDecoder().decode(json)) as SharedState;
    if (state.v !== 1 || !Array.isArray(state.f)) return null;
    const files = state.f
      .filter(entry => Array.isArray(entry) && typeof entry[0] === 'string' && typeof entry[1] === 'string')
      .map(([name, content]) => ({ name, content }));
    return files.length ? { files, open: state.o ?? null } : null;
  } catch {
    return null;
  }
}
