import { it } from 'vitest'

/*
  SIGNAL - Ce test illustre comment gérer un test qui dépasse volontairement son timeout
  et comment Vitest permet d'interrompre proprement les opérations async
  via le `signal`. Le test échoue intentionnellement, enlever le .skip() pour l'exécuter.

  ✅ Fonctionnement :

  * La Promise ne se résout jamais → le test bloque.
  * Le timeout du test est fixé à 2000ms.
  * Lorsque le test dépasse ce délai, Vitest déclenche automatiquement :
      signal.abort()
  * L’event listener sur `signal` capture l’abort et rejette la Promise
      → le test échoue avec une erreur 'Timeout'.
  * Le `console.log` permet de vérifier que le signal a bien été déclenché.

  🔹 Utilité :

  * Permet de **tester et gérer les timeout** dans des opérations async longues
  * Garantit que les ressources bloquantes (fetch, timers, DB, etc.) sont interrompues
  * Utile pour éviter les fuites ou side-effects dans les tests parallèles

  ⚠️ Points d’attention :

  * `signal` n’interrompt pas automatiquement le code async → il faut gérer `abort`
  * Idéal pour les tests long-running ou les tests où les ressources doivent être libérées
  * Sans ce mécanisme, le test pourrait bloquer ou consommer inutilement des ressources

  👉 Bonne pratique :

  * Toujours écouter `signal.abort` dans les tests avec async long-running
  * Rejeter ou nettoyer proprement pour éviter que le code continue après le timeout
  * Combiner avec `onTestFailed` ou `annotate` pour logging et reporting
  */

it.skip('will timeout for sure', async ({ signal }) => {
    // Promise qui ne se résout jamais
    await new Promise((resolve, reject) => {
        signal.addEventListener('abort', () => {
            console.log("SIGNAL avorté ? : ", signal.aborted);
            reject(new Error('Timeout'))
        })
    })
}, 2000)