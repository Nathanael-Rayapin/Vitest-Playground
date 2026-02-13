import { describe, it, expect } from 'vitest'

describe('test.skipIf - skip selon condition', () => {
  const isDev = true

  it.skipIf(isDev)('should run only if condition is false', () => {
    expect(true).toBe(true)
  })
})
