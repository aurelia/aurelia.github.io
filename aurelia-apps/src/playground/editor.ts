import { EditorView, basicSetup } from 'codemirror';
import { Compartment, EditorState, type Extension } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { HighlightStyle, syntaxHighlighting, indentUnit } from '@codemirror/language';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { tags as t } from '@lezer/highlight';

// Colours come from the Aurelia brand: blue for structure, pink for literals.
const lightHighlight = HighlightStyle.define([
  { tag: [t.keyword, t.modifier, t.operatorKeyword, t.controlKeyword], color: '#003f8c' },
  { tag: [t.string, t.special(t.string), t.regexp], color: '#a8175c' },
  { tag: [t.number, t.bool, t.null, t.atom], color: '#8a4b00' },
  { tag: [t.comment, t.lineComment, t.blockComment], color: '#6b7280', fontStyle: 'italic' },
  { tag: [t.typeName, t.className, t.namespace], color: '#0b5f87' },
  { tag: [t.tagName, t.angleBracket], color: '#003f8c' },
  { tag: [t.attributeName], color: '#0d6b5e' },
  { tag: [t.attributeValue], color: '#a8175c' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#3d3f9a' },
  { tag: [t.definition(t.variableName), t.definition(t.propertyName)], color: '#1f2328' },
  { tag: [t.propertyName], color: '#3b4250' },
  { tag: t.invalid, color: '#c62828' },
]);

const darkHighlight = HighlightStyle.define([
  { tag: [t.keyword, t.modifier, t.operatorKeyword, t.controlKeyword], color: '#8fb8ff' },
  { tag: [t.string, t.special(t.string), t.regexp], color: '#ff8cc4' },
  { tag: [t.number, t.bool, t.null, t.atom], color: '#f2b766' },
  { tag: [t.comment, t.lineComment, t.blockComment], color: '#8b93a1', fontStyle: 'italic' },
  { tag: [t.typeName, t.className, t.namespace], color: '#74c7ec' },
  { tag: [t.tagName, t.angleBracket], color: '#8fb8ff' },
  { tag: [t.attributeName], color: '#6fd6c2' },
  { tag: [t.attributeValue], color: '#ff8cc4' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#b9c3ff' },
  { tag: [t.definition(t.variableName), t.definition(t.propertyName)], color: '#e6e8eb' },
  { tag: [t.propertyName], color: '#cdd3dc' },
  { tag: t.invalid, color: '#ff6b6b' },
]);

const baseTheme = EditorView.theme({
  '&': { height: '100%', fontSize: '14px' },
  '.cm-scroller': {
    fontFamily: '"Source Code Pro", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    lineHeight: '1.6',
  },
  '.cm-content': { padding: '12px 0' },
  '.cm-gutters': { border: 'none' },
  '&.cm-focused': { outline: 'none' },
});

const lightTheme = [
  EditorView.theme({
    '&': { backgroundColor: '#ffffff', color: '#1f2328' },
    '.cm-gutters': { backgroundColor: '#ffffff', color: '#9aa1ab' },
    '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: '#f6f7f9' },
    '.cm-cursor': { borderLeftColor: '#ed2b88' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': { backgroundColor: '#fbd3e6' },
    '.cm-matchingBracket': { backgroundColor: '#e8eefb', outline: '1px solid #b9c8e8' },
  }, { dark: false }),
  syntaxHighlighting(lightHighlight),
];

const darkTheme = [
  EditorView.theme({
    '&': { backgroundColor: '#111827', color: '#e6e8eb' },
    '.cm-gutters': { backgroundColor: '#111827', color: '#5d6675' },
    '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: '#172033' },
    '.cm-cursor': { borderLeftColor: '#ff4da1' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': { backgroundColor: '#5a2343' },
    '.cm-matchingBracket': { backgroundColor: '#22304a', outline: '1px solid #3c5480' },
    '.cm-tooltip': { backgroundColor: '#1f2937', color: '#e6e8eb', border: '1px solid #374151' },
  }, { dark: true }),
  syntaxHighlighting(darkHighlight),
];

function language(name: string): Extension {
  if (name.endsWith('.html')) return html({ selfClosingTags: true });
  if (name.endsWith('.css')) return css();
  return javascript({ typescript: name.endsWith('.ts') });
}

export class PlaygroundEditor {
  private readonly view: EditorView;
  private readonly states = new Map<string, EditorState>();
  private readonly themes = new Compartment();
  private dark: boolean;
  private current: string | null = null;

  constructor(
    parent: HTMLElement,
    private readonly onChange: (name: string, content: string) => void,
    dark: boolean,
  ) {
    this.dark = dark;
    this.view = new EditorView({
      parent,
      root: parent.getRootNode() as ShadowRoot | Document,
      dispatch: (tr, view) => {
        view.update([tr]);
        if (this.current) this.states.set(this.current, view.state);
        if (tr.docChanged && this.current) this.onChange(this.current, view.state.doc.toString());
      },
    });
  }

  private createState(name: string, content: string): EditorState {
    return EditorState.create({
      doc: content,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        indentUnit.of('  '),
        EditorState.tabSize.of(2),
        baseTheme,
        this.themes.of(this.dark ? darkTheme : lightTheme),
        language(name),
      ],
    });
  }

  /** Replaces every file, dropping undo history. */
  load(files: { name: string; content: string }[], open: string): void {
    this.states.clear();
    for (const file of files) this.states.set(file.name, this.createState(file.name, file.content));
    this.current = null;
    this.open(open);
  }

  add(name: string, content: string): void {
    this.states.set(name, this.createState(name, content));
  }

  remove(name: string): void {
    this.states.delete(name);
  }

  open(name: string): void {
    const state = this.states.get(name);
    if (!state) return;
    this.current = name;
    this.view.setState(state);
    this.applyTheme();
  }

  setDark(dark: boolean): void {
    if (dark === this.dark) return;
    this.dark = dark;
    this.applyTheme();
  }

  private applyTheme(): void {
    this.view.dispatch({ effects: this.themes.reconfigure(this.dark ? darkTheme : lightTheme) });
  }

  focus(): void {
    this.view.focus();
  }

  destroy(): void {
    this.view.destroy();
  }
}
