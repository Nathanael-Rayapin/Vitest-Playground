import { it, onTestFailed } from 'vitest'

/*
    TEST + HOOK onTestFailed
  
    Ce test montre comment Vitest permet de **réagir aux échecs de test** 
    via le hook `onTestFailed` tout en utilisant un signal pour gérer les timeout.
    Le test échoue intentionnellement, enlever le .skip() pour l'exécuter.
  
    ✅ Fonctionnement :
  
    * La Promise ne se résout jamais → le test dépasse le timeout (ici 2000ms)
    * Vitest déclenche automatiquement `signal.abort()`
    * La Promise rejette avec `new Error('Timeout')`
    * Le hook `onTestFailed(({ task }) => ...)` est appelé automatiquement
      avec le contexte du test (`task.result.errors` contient toutes les erreurs)
  
    🔹 Utilité :
  
    * Capturer et logger toutes les erreurs d’un test dès qu’il échoue
    * Nettoyer ou analyser les ressources async en combinaison avec `signal`
    * Générer des métriques ou reporting custom pour CI/CD
  
    ⚠️ Points d’attention :
  
    * `signal` ne stoppe pas automatiquement le code async → il faut gérer `abort`
    * `onTestFailed` ne déclenche que **lorsqu’un test échoue**
    * Ce pattern est utile surtout pour les tests long-running ou parallèles
  
    👉 Bonne pratique :
  
    * Utiliser `signal` pour interrompre proprement les opérations async longues
    * Utiliser `onTestFailed` pour capturer et logger les erreurs ou artefacts
    * Combiner les deux permet un contrôle complet du test et de ses effets
    */

it.skip(false, 'should run a console.log on test failure', async ({ signal }) => {
    onTestFailed(({ task }) => {
        console.log("onTestFailed Erreurs : ", task.result.errors)
    })

    await new Promise((resolve, reject) => {
        signal.addEventListener('abort', () => {
            reject(new Error('Timeout'))
        })
    })
}, 2000)