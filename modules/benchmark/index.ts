import { Provider, Benchmark } from '../core';
import { _Benchmark } from './src/benchmark';

export const BENCHMARK_PROVIDERS: Provider[] = [
  { provide: Benchmark, useClass: _Benchmark }
];
