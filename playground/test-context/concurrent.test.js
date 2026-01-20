import { it, expect } from 'vitest'

/*
CONCURRENT - permet d’exécuter plusieurs tests EN PARALLÈLE.

✅ Quand l’utiliser :

* Tests purement synchrones ou asynchrones indépendants
* Logique métier sans état partagé
* Calculs, fonctions utilitaires, transformations de données
* Objectif : accélérer la suite de tests

⚠️ Points d’attention :

* Les tests s’exécutent en même temps → risques de conflits
* Le expect global est partagé entre les tests concurrents
* Les snapshots (inline ou fichiers) peuvent entrer en collision

👉 Bonne pratique :

* Pour les snapshots ou scénarios complexes en concurrent,
  utiliser expect fourni par le contexte du test :
  it.concurrent('...', ({ expect }) => { ... })

Cela garantit :

* isolation des assertions
* snapshots fiables
* absence de conditions de course (race conditions)
  */

it.concurrent('should add numbers', () => {
    expect(2 + 2).toMatchInlineSnapshot(`4`)
})

it.concurrent('should multiply numbers', () => {
    expect(2 * 2).toMatchInlineSnapshot(`4`)
})