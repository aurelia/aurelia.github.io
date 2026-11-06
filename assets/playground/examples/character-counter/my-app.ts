export class MyApp {
  limit = 140;
  text = '';

  get remaining() {
    return this.limit - this.text.length;
  }

  get words() {
    const trimmed = this.text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }
}

// Used in the view as `value.bind="limit | number"`.
export class NumberValueConverter {
  fromView(value: string) {
    return Number(value) || 0;
  }
}
