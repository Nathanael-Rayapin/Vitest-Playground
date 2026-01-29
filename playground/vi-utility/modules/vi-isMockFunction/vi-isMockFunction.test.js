import { describe, it, expect, vi } from 'vitest';

/*
  ✅ Fonctionnement :

  `vi.isMockFunction(fn)` permet de déterminer à l’exécution
  si une fonction donnée est une **fonction mockée Vitest** (`vi.fn`)
  ou une fonction JavaScript classique.

  * Retourne `true` si la fonction est un mock Vitest
  * Retourne `false` pour une fonction réelle
  * Ne modifie pas la fonction → c’est un simple check

  Lorsqu’un mock est détecté :
  * TypeScript peut traiter la fonction comme un `Mock`
  * On peut appeler en toute sécurité :
      - `mockReturnValue`
      - `mockImplementation`
      - `mock.calls`
      - `mock.results`

  🔹 Pourquoi c’est utile :

  Dans du code de test générique ou utilitaire, on ne sait pas toujours
  si une fonction reçue est :
  * un vrai callback
  * un mock Vitest
  * un mock partiellement remplacé

  `vi.isMockFunction` permet donc :
  * d’adapter le comportement selon le type réel de la fonction
  * d’éviter des erreurs du type :
      "mockReturnValue is not a function"
  * d’écrire du code défensif dans des helpers de test

  ⚠️ Points d’attention :

  * Ce test est **runtime uniquement** → il ne remplace pas le typage TS
  * Ne permet pas de savoir *comment* la fonction est mockée
  * Fonctionne uniquement avec des mocks créés par `vi.fn`
    (pas avec Jest, ni des spies externes)

  👉 Bonne pratique :

  * Utiliser `vi.isMockFunction` dans :
      - des helpers de test réutilisables
      - des tests conditionnels
      - des assertions adaptatives
  * Ne pas l’utiliser pour “deviner” la logique métier
  * Préférer un mock explicite quand le comportement est critique
*/

describe('vi.isMockFunction', () => {
    it('detects a mock function', () => {
        const mockFn = vi.fn();

        // true pour un mock
        expect(vi.isMockFunction(mockFn)).toBe(true);

        // TypeScript: mockFn est maintenant typé comme Mock
        mockFn.mockReturnValue('ok');

        expect(mockFn()).toBe('ok');
    });

    it('returns false for a real function', () => {
        const realFn = () => 'nope';

        expect(vi.isMockFunction(realFn)).toBe(false);
    });
});
