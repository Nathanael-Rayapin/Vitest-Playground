import { expect, test } from 'vitest'

/*
  TEST.RUNIF - Exécute conditionnellement un test selon une condition booléenne.

  ✅ Fonctionnement :

  * `test.runIf(condition)` exécute le test uniquement si la condition est vraie.
  * Sinon, le test est ignoré (skipped).
  * Ici, l’exécution dépend de `process.env.NODE_ENV`.

  🔹 Utilité :

  * Activer certains tests selon l’environnement (dev, test, CI…).
  * Éviter d’exécuter des tests spécifiques en production.

  ⚠️ Points d’attention :

  * La condition est évaluée au moment du chargement du fichier.
  * Si `NODE_ENV` change après, cela n’a aucun effet.

  👉 Bonne pratique :

  * Utiliser `runIf` pour les tests dépendants d’un environnement,
    pas pour gérer de la logique métier interne au test.
*/

const nodeEnv = process.env.NODE_ENV;

test.runIf(nodeEnv === 'development')('dev only', () => {
    expect(true).toBe(true)
})

test.runIf(nodeEnv === 'test')('test only', () => {
    expect(true).toBe(true)
})