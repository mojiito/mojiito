// tslint:disable:class-name

import { Injectable, Benchmark } from '../../core';
import { Task, TaskResult } from './task';

@Injectable()
export class _Benchmark extends Benchmark {
  private _openTasks: Task[] = [];

  startTask(name: string): any {
    const task = new Task(name);
    task.onEnd(() => {

    });
    task.start();
    return task;
  }

  endTask(task: Task): TaskResult {
    return task.end();
  }

  log(result: TaskResult) {
    if (console && console.log) {
      console.info(result.toString());
    }
  }
}
