import {
  createPlatformFactory, PlatformRef, RendererFactory, CORE_PROVIDERS, Provider
} from 'mojiito-core';
import { BrowserPlatformRef } from './platform_ref';
import { DOCUMENT } from './tokens';
import { COMPILER_PROVIDERS } from './compiler/compiler';
import { DomRendererFactory } from './dom_renderer';
import { ExpressionParser } from './compiler/expression_parser';

export { DOCUMENT, DomRendererFactory, BrowserPlatformRef, ExpressionParser };

export const PLATFORM_PROVIDERS: Provider[] = [
  { provide: PlatformRef, useClass: BrowserPlatformRef },
  { provide: DOCUMENT, useValue: document },
  { provide: RendererFactory, useClass: DomRendererFactory},
  COMPILER_PROVIDERS
];

export const platformBrowser = createPlatformFactory([PLATFORM_PROVIDERS, CORE_PROVIDERS]);
