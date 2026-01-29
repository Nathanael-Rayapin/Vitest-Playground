import { it, expect, vi } from 'vitest'

/*
  ✅ Fonctionnement :

  `vi.fn()` permet de créer une fonction mockée indépendante,
  sans dépendre d’un module ou d’un import.

  * `getApples` est une fonction mockée qui retourne `0` par défaut
  * Chaque appel à `getApples()` exécute l’implémentation courante du mock
  * L’implémentation peut être modifiée dynamiquement via :
      `mockImplementation`

  Dans le second test :
  * On change l’implémentation du mock
  * Le nouveau comportement s’applique immédiatement
  * Tous les appels suivants utilisent la nouvelle logique

  🔹 Comportement entre les tests :

  Les mocks **ne sont pas automatiquement réinitialisés** entre les tests
  si aucune configuration ou reset explicite n’est appliqué.

  Ici :
  * Le premier test utilise l’implémentation initiale → retourne `0`
  * Le second test remplace l’implémentation → retourne `1`

  ⚠️ Points d’attention :

  * Modifier l’implémentation d’un mock peut impacter les tests suivants
  * Sans `vi.resetAllMocks()` ou `vi.restoreAllMocks()`,
    l’état du mock persiste dans le fichier
  * Peut créer des dépendances implicites entre tests

  👉 Bonne pratique :

  * Réinitialiser les mocks entre les tests si le comportement varie
      → `beforeEach(() => vi.resetAllMocks())`
  * Préférer des mocks locaux au test quand le comportement est spécifique
  * Toujours rendre explicite quand un mock change d’implémentation
*/

const getApples = vi.fn(() => 0)

it('should return 0 when getApples is called', () => {
    expect(getApples()).toBe(0)
})

it('should return 1 when getApples is called', () => {
    getApples.mockImplementation(() => 1)
    expect(getApples()).toBe(1)
})