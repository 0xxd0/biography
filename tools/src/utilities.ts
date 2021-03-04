import { glob } from 'glob'
import * as fs from 'fs'
import * as path from 'path'

export function traverse(path: string, callback: (err: Error | null, matches: string[]) => void) {
  glob(path + '/**/*', callback)
}

declare global {
  interface String {
    isMarkdwonFile(): boolean;
    isDirectory(): boolean;
    replaceAll(s1: string, s2: string): string;
  }
} 

String.prototype.isMarkdwonFile = function (): boolean {
  return path.extname(this.toString()) == '.md'
}

String.prototype.isDirectory = function (): boolean {
  return !fs.statSync(this.toString()).isDirectory()
}

String.prototype.replaceAll = function(s1: string, s2: string) {
  return this.replace(new RegExp(s1, "gm"), s2);
}