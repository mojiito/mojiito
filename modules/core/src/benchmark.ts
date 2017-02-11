export abstract class Benchmark {
  abstract startTask(name: string): any;
  abstract endTask(task: any): any;
  abstract log(taskResult: any): void;
}
