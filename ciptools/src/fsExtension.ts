import { glob } from 'glob'
import * as fs from 'fs'
import * as path from 'path'

export function traverse(path: string, callback: (err: Error | null, matches: string[]) => void) {
  glob(path + '/**/*', callback)
}

declare global{
  interface String {
    
    isMarkdwonFile(): boolean;

    isDirectory(): boolean;
  }
} 

String.prototype.isMarkdwonFile = function (): boolean {
  return path.extname(this.toString()) == '.md'
}

String.prototype.isDirectory = function (): boolean {
  return !fs.statSync(this.toString()).isDirectory()
}