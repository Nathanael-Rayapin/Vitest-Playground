import { describe, test, expect, vi } from "vitest";
import { example, example } from "./example";

/*
  ✅ Fonctionnement :

  `vi.spyOn(object, key)` permet d’**espionner une propriété existante d’un objet**
  (méthode, getter/setter ou classe), sans remplacer tout l’objet comme `vi.mock`.

  Le spy :
  * enveloppe la propriété ciblée
  * permet de :
      - remplacer l’implémentation (`mockImplementation`, `mockReturnValue`)
      - observer les appels (`toHaveBeenCalled`, `toHaveReturned`, etc.)
  * conserve le lien avec l’objet original

  🔹 Cas 1 – Limite de `spyOn` avec les primitives :

  * `example.question` est une **string**
  * Une primitive :
      - n’a pas d’implémentation
      - n’a pas de comportement à espionner
  * `vi.spyOn` est donc impossible dans ce cas
  → `vi.mockObject` fonctionne ici uniquement parce que :
      - les primitives ne sont pas modifiées
      - la valeur est retournée telle quelle

  👉 Règle clé :
  * `vi.spyOn` ➜ fonctions / classes / getters / setters
  * primitives ➜ pas de spy possible

  🔹 Cas 2 – Espionner une fonction (`answer`) :

  * `vi.spyOn(example, "answer")` :
      - remplace temporairement l’implémentation
      - permet de tracer les appels
  * Le spy agit directement sur `example.answer`
      → tous les appels passent par le mock

  🔹 Cas 3 – Espionner une classe :

  * Lorsqu’on espionne une **classe exportée** :
      - le spy cible le **constructeur**
      - l’implémentation mockée doit être :
          - une fonction (`function () {}`)
          - ou une classe
  * Utiliser une arrow function provoquerait :
      `<anonymous> is not a constructor`

  Dans ce test :
  * Le constructeur est remplacé
  * Une nouvelle méthode est injectée sur l’instance (`newAnswer`)
  * Le spy permet :
      - de vérifier que la classe a bien été instanciée
      - de contrôler le comportement des instances créées

  ⚠️ Points d’attention :

  * `vi.spyOn` :
      - modifie temporairement l’objet ciblé
      - doit être restauré (`mockRestore`, `vi.restoreAllMocks`)
  * On ne peut pas espionner :
      - des valeurs primitives
      - des propriétés inexistantes
  * Pour les classes :
      - toujours utiliser `function` ou `class`
      - jamais une arrow function

  👉 Bonne pratique :

  * Utiliser `vi.spyOn` quand :
      - on veut tester un **comportement réel**
      - tout en observant ou modifiant ponctuellement une méthode
  * Préférer `vi.mock` ou `vi.mockObject` quand :
      - le module ou l’objet doit être totalement isolé
  * Restaurer systématiquement les spies après les tests
      (`vi.restoreAllMocks` ou `test.restoreMocks = true`)
*/

describe("vi.spyOn basics", () => {
    test("should mockObject on 'question'", () => {
        // "question" cannot be spyed on because it's not a function
        const mock = vi.mockObject(example.question);

        expect(mock).toBeTypeOf("string");
        expect(mock).toBe("what is the answer to life, the universe, and everything?");
    });

    test("should mockImplementation on 'answer'", () => {
        const spy = vi.spyOn(example, "answer").mockImplementation(() => 10);

        expect(example.answer()).toBe(10);
        expect(spy).toHaveBeenCalled();
    });
})

describe("vi.spyOn class definition", () => {
    test("should mockReturnValue on 'question'", () => {
        const spy = vi.spyOn(example, "Example").mockImplementation(function () {
            this.newAnswer = () => 10;
        });

        const instance = new example.Example();
        instance.newAnswer();

        expect(instance.newAnswer()).toBe(10);
        expect(spy).toHaveBeenCalled();
    });
})