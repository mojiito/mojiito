import { DOMParser } from './dom-parser/dom-parser';

const parser = new DOMParser();
console.time('parse');
parser.parseTree(document.body);
console.timeEnd('parse');