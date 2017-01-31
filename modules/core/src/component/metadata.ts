export class ComponentMetadata {
  selector: string;
  constructor({ selector }: { selector?: string } = {}) {
    this.selector = selector;
  }
}
