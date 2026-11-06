export interface Todo {
  title: string;
  done: boolean;
}

export class MyApp {
  newTitle = '';
  todos: Todo[] = [
    { title: 'Try the playground', done: true },
    { title: 'Edit a component', done: false },
  ];

  get remaining() {
    return this.todos.filter(todo => !todo.done).length;
  }

  add() {
    const title = this.newTitle.trim();
    if (!title) return;
    this.todos.push({ title, done: false });
    this.newTitle = '';
  }

  remove(todo: Todo) {
    this.todos.splice(this.todos.indexOf(todo), 1);
  }
}
