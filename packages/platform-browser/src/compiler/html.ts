export interface Attribute {
  readonly name: string;
  readonly prefix: string | null;
  readonly specified: boolean;
  value: string;
}
