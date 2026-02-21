import { describe, it, expect } from 'vitest'

/*
  TEST.SKIPIF - Ignore conditionnellement un test selon une condition.

  ✅ Fonctionnement :

  * `it.skipIf(condition)` ignore le test si la condition est vraie.
  * Si la condition est fausse, le test s’exécute normalement.
  * Ici, `isDev === true` → le test sera skipped.

  🔹 Utilité :

  * Désactiver temporairement des tests selon un contexte (env, feature flag…).
  * Éviter certains tests en développement ou CI.

  ⚠️ Points d’attention :

  * La condition est évaluée au chargement du fichier.
  * Un test skipped n’est pas exécuté et n’affecte pas le résultat global.

  👉 Bonne pratique :

  * Préférer `skipIf` à des `if` internes pour garder un reporting clair.
*/

describe('test.skipIf - skip selon condition', () => {
  const isDev = true

  it.skipIf(isDev)('should run only if condition is false', () => {
    expect(true).toBe(true)
  })
})
