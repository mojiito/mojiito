import { WrappedError } from '../../facade';

export class Task {
  private _startTime: number;
  private _endTime: number;
  private _startCB: Function[] = [];
  private _endCB: Function[] = [];
  private _subTasks: Task[] = [];

  get hasStarted(): boolean { return !!this._startTime; }
  get hasEnded(): boolean { return !!this._startTime && !!this._endTime; }
  get startTime(): number { return this._startTime; }
  get endTime(): number { return this._endTime; }

  constructor(public name: string) { }

  start() {
    if (this.hasStarted) {
      throw new TaskError(`Can not start task ${this.name} because task is already running!`);
    }
    if (this.hasEnded) {
      throw new TaskError(`Can not start task ${this.name} because task has already ended!`);
    }
    this._startTime = Date.now();
  }

  end(): TaskResult {
    if (!this.hasStarted) {
      throw new TaskError(`Can not end task ${this.name} because task has not been started!`);
    }
    if (this.hasEnded) {
      throw new TaskError(`Can not end task ${this.name} because task has already ended!`);
    }
    this._endTime = Date.now();
    return new TaskResult(this.name, this._startTime, this._endTime);
  }

  addTask(task: Task) {

  }

  onStart(cb: Function) {
    if (this.hasStarted) {
      cb();
    }
    this._startCB.push(cb);
  }

  onEnd(cb: Function) {
    if (this.hasEnded) {
      cb();
    }
    this._endCB.push(cb);
  }

  private _openSubTask() {
    if(this._subTasks.length) {

    }
  }
}

export class TaskResult {
  constructor(private taskName: string, private _startTime: number, private _endTime: number) { }
  get duration(): number { return this._endTime - this._startTime; }
  get durationString(): string {
    let d = this.duration;
    let ext = 'ms';
    if (d > 1000) {
      d = d / 1000;
      ext = 's';
    }
    if (d > 60) {
      d = d / 60;
      ext = 'min';
    }
    return (ext === 'ms' ? d : d.toFixed(4)) + ext;
  }
  toString() {
    return `Mojito Task ${this.taskName}: ${this.durationString}`;
  }
}

export class TaskError extends WrappedError {
  constructor(error: any) {
    super(`Benchmark Task Error`, error);
  }
}


