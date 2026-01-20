import { it, expect, onTestFinished } from "vitest"

 /*

  onTestFinished - Ce test montre comment utiliser le hook `onTestFinished` pour **réagir immédiatement
  à la fin d’un test**, que celui-ci passe ou échoue.

  ✅ Fonctionnement :

  * `onTestFinished(callback)` est appelé **après la fin du test**, une fois que toutes
    les assertions et async sont terminées.
  * La callback reçoit le contexte du test (`task`) avec :
      - `task.result.state` → l’état final du test (`pass`, `fail`, `skipped`)
      - `task.result.errors` → éventuelles erreurs
  * Ici, on logue `task.result.state` → devrait afficher `"pass"` puisque l’assertion
    `expect(true).toBe(true)` réussit.

  🔹 Utilité :

  * Permet de faire du **logging ou reporting post-test**
  * Utile pour déclencher des actions ou nettoyer des ressources après que le test a fini
  * Complète `onTestFailed` en couvrant les tests réussis

  ⚠️ Points d’attention :

  * Le hook se déclenche **après toutes les assertions et async** → pas avant
  * Ne modifie pas l’état du test → usage principalement informatif ou pour cleanup
  * Pour les tests parallèles, chaque test appelle son propre `onTestFinished`

  👉 Bonne pratique :

  * Utiliser `onTestFinished` pour logging, reporting ou cleanup post-test
  * Combiner avec `signal` pour interrompre proprement les tests timeout ou async
  * Coupler avec `annotate` pour enrichir les informations visibles dans les reporters
  */

it('should run a console.log when test finished', () => {
    onTestFinished(({ task }) => {        
        console.log("onTestFinished", task.result.state)
    })

    expect(true).toBe(true)
}, 2000)
