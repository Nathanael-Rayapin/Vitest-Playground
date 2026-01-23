export function add(x: number, y: number): number {
  return x + y
}

export function fetchSomething(): Promise<Response> {
  return fetch('https://vitest.dev/')
}