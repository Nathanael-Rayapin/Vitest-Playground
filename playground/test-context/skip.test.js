import { it, expect, test as baseTest } from 'vitest'

const test = baseTest.extend({ mind: 'foggy' })

/* 
SKIP - Permet de passer un test sans l'exécuter 
Accepte aussi un boolean en paramètre (2nd test). Ici le type "mind" est créer via un extend

⚠️ Points d’attention :

* skip() décide au moment de l’exécution du test,
* it.skip() décide au moment de la définition du test.

```
function skip(note?: string): never
function skip(condition: boolean, note?: string): void
```
*/
it('should skip this test', ({ skip }) => {
    skip("Une simple note visible dans les logs ou à l'attention du développeur")
    expect(true).toBe(false)
})

test('should skip this test', ({ skip, mind }) => {
    skip(mind === 'foggy')
    expect(true).toBe(false)
})