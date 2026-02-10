import { describe, test, expect, vi } from "vitest";
import { example } from "./example";

/*
  ✅ Fonctionnement :

  `vi.mockObject(value)` applique le **même mécanisme d’auto-mocking que `vi.mock()`**,
  mais sur un **objet ou une fonction existante**, sans passer par le système de modules.

  Comportement par défaut (sans option) :
  * Les fonctions sont remplacées par des mocks (`vi.fn`)
      → leur implémentation originale est supprimée
      → elles retournent `undefined`
  * Les primitives (string, number, boolean) restent inchangées
  * Les objets sont mockés récursivement

  🔹 Cas couverts par ces tests :

  1️⃣ Mock sans implémentation (auto-mock)
  * `vi.mockObject(answer)` transforme la fonction en mock
  * Aucune implémentation fournie
      → la fonction retourne `undefined`
  * Utile pour :
      - bloquer totalement le comportement réel
      - vérifier uniquement les appels

  2️⃣ Mock avec implémentation personnalisée
  * Le mock peut recevoir une implémentation via :
      - `mockImplementation`
      - `mockReturnValue`
  * Le comportement réel est remplacé
      → la fonction retourne la valeur mockée
  * Utile pour :
      - forcer des valeurs de retour
      - tester des scénarios précis

  3️⃣ Mock avec `{ spy: true }`
  * Le mock conserve **l’implémentation originale**
  * La fonction :
      - exécute le code réel
      - reste traçable (`toHaveBeenCalled`, `mock.results`, etc.)
  * Équivalent conceptuellement à un **spy global sur l’objet**
      (comme `vi.mock(..., { spy: true })` pour un module)

  ⚠️ Points d’attention :

  * Sans implémentation explicite, une fonction mockée retourne toujours `undefined`
      → ce n’est PAS une erreur, c’est le comportement normal
  * `vi.mockObject` **modifie l’objet passé par référence**
      → `mockedAnswer === answer`
  * `{ spy: true }` ne remplace PAS l’implémentation
      → il l’enrobe pour pouvoir la tracer

  👉 Bonne pratique :

  * Utiliser `vi.mockObject` pour :
      - mocker des objets utilitaires
      - mocker des dépendances non modulaires
      - éviter `vi.mock` quand il n’y a pas de module
  * Utiliser `{ spy: true }` quand :
      - le comportement réel doit rester intact
      - mais que les appels doivent être observés
  * Toujours être explicite sur l’intention :
      - bloquer (auto-mock)
      - remplacer (mockImplementation)
      - observer (spy)
*/

describe("vi.mockObject", () => {
    test("should mock an object from original without any modification", () => {
        const mockedQuestion = vi.mockObject(example.question);
        const mockedAnswer = vi.mockObject(example.answer);

        expect(mockedQuestion).toBeTypeOf("string");
        expect(mockedAnswer()).toBe(undefined); // 👈 mocked function return undefined
    });

    test("should mock an object function from original with mock implementation", () => {
        const mockedAnswer = vi.mockObject(example.answer);

        mockedAnswer.mockImplementation(() => 10);

        expect(mockedAnswer()).toBe(10); // 👈 mocked function return 10
    });

    test("should mock an object function from original with spy", () => {
        const mockedAnswer = vi.mockObject(example, { spy: true });

        expect(mockedAnswer()).toBe(1); // 👈 mocked function return 1
    });
})