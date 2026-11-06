import { bindable } from 'aurelia';
import type { Todo } from './my-app';

export class TodoItem {
  @bindable todo: Todo;
  @bindable onRemove: () => void;
}
