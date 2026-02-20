import { describe, it, expect } from 'vitest'

/*
  Se référer à test-context/skip.test.js pour plus de détails.
*/

describe('test.skip', () => {
  it.skip('should not execute this test', () => {
    expect(1 + 1).toBe(3)
  })
})
