import { add } from './example'
import { vi, it, expect } from 'vitest'

/*
  ✅ Fonctionnement :

  Ce test montre l'utilisation de `vi.importActual()` et le compare
  avec une autre façon de faire : `importOriginal`

  Les deux permettent de :
  * importer le module réel
  * conserver son comportement par défaut
  * surcharger uniquement certains exports (ici `add`)

  👉 En pratique, `importOriginal` est un **wrapper ergonomique**
  autour de `vi.importActual()`.

  🔹 Pourquoi `importOriginal` est préférable :

  * Le chemin du module est passé via `import('./example')`
      → TypeScript vérifie que le fichier existe
  * `importOriginal()` connaît déjà le bon module à importer
      → aucun risque de typo ou de chemin dupliqué
  * Le typage et l’auto-complétion sont conservés automatiquement

  À l’inverse, avec `vi.importActual('./example')` :
  * le chemin est une string non vérifiée
  * une simple typo peut casser le mock sans warning TypeScript

  🔍 Différence entre les deux tests :

  * Premier test (`vi.mock + importOriginal`)
      → le mock s’applique avant l’exécution avant tous les imports
      → les imports statiques utilisent directement le mock

  * Second test (`vi.doMock + vi.importActual`)
      → le mock est appliqué après le premier mock et après les imports donc pour qu'il fasse effet on réimporte le module
      → seul l’import effectué après `vi.doMock` reçoit le mock

  ⚠️ Points d’attention :

  * `vi.mock` est hoisté → il s’applique avant les imports
  * `vi.doMock` est évalué au runtime → il n’affecte que les imports dynamiques
  * Mélanger les deux dans un même fichier peut prêter à confusion

  👉 Bonne pratique :

  * Toujours préférer `importOriginal` en TypeScript
      → plus sûr, plus lisible, mieux typé
  * Utiliser `vi.importActual()` uniquement pour des cas très spécifiques
  * Documenter clairement si un mock est hoisté (`vi.mock`)
    ou dynamique (`vi.doMock`)
*/

vi.mock(import('./example'), async (importOriginal) => {
  const mod = await importOriginal()
  console.log("MODE : ", mod);
  return {
    ...mod,
    add: vi.fn().mockReturnValue(10)
  }
})

it('should import from original', () => {
  add(1, 1)
  expect(add(1, 1)).toBe(10)
})

vi.doMock(import('./example'), async () => {
  const originalModule = await vi.importActual('./example')
  console.log("MODULE : ", originalModule);
  return {
    ...originalModule,
    add: vi.fn().mockReturnValue(20)
  }
})

it('should import from actual', async () => {
  const { add } = await import('./example')
  add(1, 1)
  expect(add(1, 1)).toBe(20)
})
