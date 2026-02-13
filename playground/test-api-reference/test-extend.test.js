import { describe, expect, test } from 'vitest'

describe('test.extend', () => {
  const todos = [];

  const myTest = test.extend({
    todos: async ({}, use) => {
      todos.push(1, 2, 3)
      await use(todos)
      todos.length = 0
    }
  })

  myTest('should inject custom fixture and allow mutation', ({ todos }) => {
    expect(todos.length).toBe(3)
    todos.push(4)
    expect(todos.length).toBe(4)
  })
})
