import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    include: ['./playground/test-context/**/*.test.{ts,js}'],
                    exclude: [
                        './playground/test-context/extend.test.js', 
                        './playground/test-context/extend-syntax-explication.test.js'
                    ],
                    name: 'default',
                    environment: 'node',
                    provide: {
                        url: '/default'
                    }
                },
            },
            {
                test: {
                    include: [
                        './playground/test-context/extend.test.js', 
                        './playground/test-context/extend-syntax-explication.test.js'
                    ],
                    name: 'extend',
                    environment: 'node',
                    provide: {
                        url: '/extend'
                    }
                },
            },
            {
                test: {
                    include: ['./playground/vi-utility/**/*.test.{ts,js}'],
                    name: 'vi-utility',
                    environment: 'node'
                },
            },
        ]
    }
})