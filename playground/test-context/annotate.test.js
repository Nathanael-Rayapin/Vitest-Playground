import { it, expect } from 'vitest'

/*
 ANNOTATE - Ce test montre comment utiliser la fonction `annotate` pour attacher un message
 ou un artefact à un test, utile pour documenter des comportements particuliers.

 ✅ Fonctionnement :

 * `annotate('Fails randomly on CI', 'flaky')` ajoute une annotation de type `flaky`
   au test courant.
 * Cette annotation est attachée au test et sera transmise au reporter de Vitest.
 * La fonction retourne une Promise → elle doit idéalement être awaitée.

 🔹 Utilité :

 * Signaler un test instable ou connu pour flaky
 * Ajouter des messages explicatifs pour CI/CD
 * Attacher des fichiers ou artefacts pour debug ou reporting
 * Permet d’enrichir les résultats de test sans affecter le statut global

 ⚠️ Points d’attention :

 * Selon le reporter, l’annotation sera visible différemment :
   - `verbose` → toujours affichée
   - `default` → seulement si le test échoue
   - `UI / HTML` → visible directement dans l’interface
 * Ne remplace pas les assertions : le test peut toujours passer ou échouer indépendamment

 👉 Bonne pratique :

 * Utiliser `annotate` pour signaler les tests instables ou joindre des informations utiles
 * Combiner avec `signal` ou `onTestFailed` pour les tests longs ou critiques
 */

it('should show annotations on terminal when test with verbose mode', async ({ annotate }) => {
    await annotate('Fails randomly on CI - probably plotting to take over the world', 'flaky')
    expect(true).toBe(true)
})