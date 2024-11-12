export function clean(str: any) {
  if (!str) return str;
  return str.replace(/[^a-zA-Z0-9]/g, "");
}
