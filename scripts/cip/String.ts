interface String {
  replaceAll(s1: string, s2: string): string;
}

String.prototype.replaceAll = function(s1: string, s2: string) {
  return this.replace(new RegExp(s1, "gm"), s2);
}