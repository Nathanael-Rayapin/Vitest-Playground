import { describe, it, expect } from 'vitest'

describe('test.skip', () => {
  it.skip('should not execute this test', () => {
    expect(1 + 1).toBe(3)
  })
})
