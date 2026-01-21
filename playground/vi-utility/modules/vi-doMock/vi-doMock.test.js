import { vi, it, expect } from 'vitest'
import { answer1, otherAnswer1 } from './example.js'

/*
  ✅ Fonctionnement :

  * `vi.doMock(import('./example-1.js'), factory)` permet de **définir un mock dynamiquement après les importations initiales**.
  * Les imports statiques déjà évalués avant le `doMock` (l-2) **ne sont pas affectés** :
      → `answer1()` et `otherAnswer1()` restent sur les valeurs originales (ici 1).
  * Tout nouvel import effectué **après le `doMock`** récupère le module mocké :
      → `answer1()` et `otherAnswer1()` retournent désormais `myNumber` (4)

  🔹 Particularité :

  * Utile pour mocker conditionnellement ou sur des modules importés dynamiquement
  * Contrairement à `vi.mock`, `vi.doMock` **n’applique pas le mock aux imports existants**
  * Permet de changer le comportement d’un module uniquement pour les imports suivants

  ⚠️ Points d’attention :

  * Ne pas confondre avec `vi.mock` qui s’applique avant l’exécution du test et remplace tous les imports existants
  * Les fonctions simples (non `vi.fn()`) ne peuvent pas être trackées
  * `vi.doMock` est souvent utilisé pour des tests de modules dynamiques ou pour des tests où l’ordre d’import est important

  👉 Bonne pratique :

  * Toujours importer **après** le `vi.doMock` si vous voulez récupérer le module mocké
  * Utiliser `vi.fn()` pour toutes les fonctions dont vous souhaitez tracker les appels
  * Privilégier `vi.mock` si le module peut être mocké avant tout import
*/

const myNumber = 4;

vi.doMock(import('./example.js'), () => {
    return {
        answer1: () => myNumber,
        otherAnswer1: vi.fn(() => myNumber)
    }
})

it('importing the next module imports mocked one', async () => {
    // L'importation d'origine N'A PAS ÉTÉ MOCKER, car vi.doMock est évalué APRÈS les importations.
    // Donc le résultat reste à 1.
    expect(answer1()).toBe(1)
    expect(otherAnswer1()).toBe(1)

    const importAfterDoMock = await import('./example.js')

    // Ici, le mock est appliqué après l'import, donc le résultat est 4.
    expect(importAfterDoMock.answer1()).toBe(4)
    expect(importAfterDoMock.otherAnswer1()).toBe(4)
})