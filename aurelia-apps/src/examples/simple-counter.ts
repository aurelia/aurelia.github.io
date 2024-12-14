import { customElement } from 'aurelia';

@customElement({
  name: 'simple-counter',
  template: `
    <p style="margin-top:0;">Current count: \${count}</p>
    <button click.trigger="increment()">Increment</button>
  `,
  shadowOptions: {
    mode: 'open',
  },
})
export class SimpleCounter {
  count = 0;

  increment() {
    this.count++;
  }
}
