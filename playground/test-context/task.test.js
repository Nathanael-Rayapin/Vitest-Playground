import { it, expect } from 'vitest'

/*
 TASK - Ce test montre comment accéder aux **métadonnées du test courant** via le contexte `task`.

 ✅ Fonctionnement :

 * `task` contient toutes les informations sur le test en cours :
   - nom du test (`task.name`)
   - statut (`task.result.state`)
   - erreurs éventuelles (`task.result.errors`)
   - annotations, fixtures et autres métadonnées
 * Ici, on logue `task` pour observer son contenu dans la console.

 🔹 Utilité :

 * Inspecter ou debuguer les données liées au test
 * Générer des rapports custom ou analyser l’état d’un test à l’exécution
 * Accéder à des informations dynamiques comme les fixtures ou les annotations

 ⚠️ Points d’attention :

 * `task` est disponible uniquement via le contexte injecté dans le test
 * Ne modifie pas l’état du test → usage principalement informatif
 * Pour les tests parallèles, chaque `task` correspond à son test spécifique

 👉 Bonne pratique :

 * Utiliser pour debug ou reporting personnalisé
 * Ne pas dépendre de `task` pour la logique métier du test
 * Combiner avec `annotate` ou `onTestFailed` pour enrichir les logs ou CI
 */

it('should show metadata context', ({ task }) => {
    console.log("METADATA : ", task)
    expect(task.name).toBe('should show metadata context')
})