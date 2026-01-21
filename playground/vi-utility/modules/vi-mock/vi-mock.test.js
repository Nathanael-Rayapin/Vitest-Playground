import { vi, test, expect } from 'vitest'
import { answer1, otherAnswer1 } from './example-1.js'
import { answer2, otherAnswer2 } from './example-2.js'
import { answer3, otherAnswer3 } from './example-3.js'
import { Answer } from './example-4.ts'

/*
  ✅ Fonctionnement :

  `vi.mock(import('./example-1.js'), factory)` remplace entièrement le module réel
      * Le module original n’est jamais exécuté
      * Tous les exports sont remplacés par ceux de la factory
      * Si un export n'est pas défini dans la factory, appeler l'export dans le test renverra une erreur
  Les imports statiques `import { answer1, otherAnswer1 } from './example-1.js'` reçoivent automatiquement les valeurs mockées
  Le mock fonctionne **avant l’exécution du test**, donc les imports statiques voient toujours le mock

  🔹 Particularité TypeScript :

  L’utilisation d’un import dynamique `import('./example-1.js')` dans `vi.mock` n’est pas exécutée au runtime
  Elle sert uniquement à TypeScript :
      * Valider le chemin du module
      * Typage correct des exports
  Si on utilisait une string (`vi.mock('./example-1.js')`), TypeScript ne pourrait pas typer correctement le module

  ⚠️ Points d’attention :

  Même si on utilise des imports statiques dans le test, ils utilisent le mock
  Utiliser `vi.mock` dans un **setup file** si le mock doit être appliqué à tous les tests automatiquement
  `vi.mock` s'applique en priorité sur tous les tests, donc si 2 même `vi.mock` sont définis, le second surcharge le premier

  👉 Bonne pratique :

  Toujours préférer `vi.mock(import('./module'))` en TypeScript pour bénéficier du typage et éviter les erreurs
  Documenter clairement ce qui est mocké et pourquoi
  Pour des mocks partiels, utiliser `importOriginal` à l’intérieur de la factory
*/

vi.mock(import('./example-1.js'), () => {
    return {
        answer1: () => 2,
        otherAnswer1: vi.fn(() => 2)
    }
})

test('should mock the module', () => {
    expect(answer1()).toBe(2)
})

/*
  ✅ Fonctionnement :

  Ce test illustre la différence entre une **fonction remplacée** et une
  **fonction mockée (trackable)** dans un module mocké avec Vitest.

  * `otherAnswer` est défini avec `vi.fn(() => 2)`
      → C’est une **mock function**
      → Vitest enregistre ses appels
      → On peut utiliser des matchers comme :
          `toHaveBeenCalled`
          `toHaveBeenCalledWith`
          `toHaveBeenCalledTimes`

  * `answer` est défini comme une fonction simple `() => 2`
      → Il est bien remplacé par le mock
      → Mais **Vitest ne peut pas suivre ses appels**
      → Impossible d’utiliser `toHaveBeenCalled` dessus

  🔹 Notion clé : tracking

  * “Tracker” une fonction = Vitest garde un historique de ses appels
  * Seules les fonctions créées avec `vi.fn()` sont trackables
  * Remplacer une fonction ≠ pouvoir l’observer

  ⚠️ Points d’attention :

  * Une fonction peut être mockée sans être trackable
  * Les assertions comportementales (`toHaveBeenCalled`, etc.)
    nécessitent toujours `vi.fn()`

  👉 Bonne pratique :

  * Utiliser `vi.fn()` dès qu’on veut vérifier qu’une fonction
    a été appelée (ou comment)
  * Réserver les fonctions simples aux valeurs de retour statiques
*/

test('should otherAnswer be called', () => {
    // answer() we can call it but it's not mocked so we can't track it
    otherAnswer1()
    expect(otherAnswer1).toHaveBeenCalled()
})

/*
  ✅ Fonctionnement :

  Ce mock illustre un mock basé sur le module original
  grâce à `importOriginal`.

  * `importOriginal()` permet de charger le **vrai module**
      → Le code original est exécuté
      → On récupère ses vraies implémentations
  * On peut ensuite :
      * Réutiliser le comportement réel
      * Le modifier
      * Ou l’envelopper dans un mock

  🔹 Détail des exports :

  * `answer2: () => originalModule.answer2()`
      → Réutilise directement la logique originale
      → La fonction est remplacée, mais **non trackable**
      → Sert uniquement à conserver le comportement réel

  * `otherAnswer2: vi.fn(originalModule.otherAnswer2)`
      → Utilise l’implémentation originale
      → MAIS la fonction est maintenant **trackée**
      → Permet des assertions comme `toHaveBeenCalled`

  🔹 Ce que teste réellement le test :

  * `answer2()` retourne la valeur réelle du module original
  * `otherAnswer2()` exécute le vrai code
  * Vitest peut vérifier les appels sur `otherAnswer2`
    grâce à `vi.fn()`

  ⚠️ Point important (doc Vitest) :

  Si le but est uniquement d’observer un export
  sans remplacer tout le module :

  👉 Il est souvent préférable d’utiliser `vi.spyOn`
      * On garde le module intact
      * On espionne seulement la fonction cible
      * Le test est plus simple et plus lisible

  👉 `importOriginal` est utile quand :
      * On veut modifier plusieurs exports
      * On doit combiner comportement réel + mock
      * On souhaite garder un contrôle fin sur le module mocké
*/

vi.mock(import('./example-2.js'), async (importOriginal) => {
    const originalModule = await importOriginal()
    return {
        answer2: () => originalModule.answer2(),
        otherAnswer2: vi.fn(originalModule.otherAnswer2)
    }
})

test('should answer and otherAnswer be called with the original example values', () => {
    expect(answer2()).toBe(2)
    otherAnswer2()
    expect(otherAnswer2).toHaveBeenCalled()
})

/*
  ✅ Fonctionnement :

  `vi.mock(import('./example-3.js'), { spy: true })` remplace le module par un mock espionné.
      * Le module original est chargé
      * Toutes les fonctions exportées conservent leur implémentation réelle
      * Chaque fonction est automatiquement transformée en spy (traçable)
      * Les appels peuvent être observés avec `toHaveBeenCalled`, `toHaveBeenCalledWith`, etc.
      * Aucun export n’est stubé → les valeurs retournées restent identiques au module réel

  Dans ce test :
      * `answer3()` exécute l’implémentation originale et retourne `3`
      * `otherAnswer3()` exécute aussi le code réel
      * Vitest enregistre l’appel à `otherAnswer3`, ce qui permet l’assertion
        `expect(otherAnswer3).toHaveBeenCalled()`

  🔹 Pourquoi utiliser `vi.mock(..., { spy: true })` :

  * Permet d’espionner **l’intégralité d’un module** en une seule ligne
  * Évite d’écrire plusieurs `vi.spyOn(...)`
  * Utile pour analyser les effets de bord ou les appels multiples dans un module
  * Très pratique dans un `setup file` pour observer automatiquement un module partagé

  ⚠️ Points d’attention (différence avec `vi.spyOn`) :

  * `vi.mock(..., { spy: true })` :
      - Remplace le module par un wrapper espionné
      - Toutes les fonctions exportées deviennent des spies
      - Portée globale au module
      - Plus implicite, peut introduire des effets de bord si utilisé abusivement

  * `vi.spyOn(module, 'method')` :
      - Ne mocke PAS le module
      - Espionne uniquement une fonction ciblée
      - Plus explicite et plus sûr
      - À privilégier quand une seule fonction doit être trackée

  👉 Bonne pratique :

  * Utiliser `vi.spyOn` pour des tests précis et localisés
  * Réserver `vi.mock(..., { spy: true })` aux cas où tout le module doit être observé
  * Éviter de mixer les deux sur le même module sans raison claire
*/

vi.mock(import('./example-3.js'), { spy: true })

test('should answer and otherAnswer be called with the original example values', () => {
    expect(answer3()).toBe(3)
    otherAnswer3()
    expect(otherAnswer3).toHaveBeenCalled()
})

/*
  ✅ Fonctionnement :

  Ce test illustre un cas **subtil mais très puissant** de `vi.mock(..., { spy: true })`
  appliqué à une **classe**.

  * Le module `example-4.ts` est mocké en mode `spy: true`
      → Les méthodes **publiques** conservent leur implémentation originale
      → Elles deviennent en plus **traçables** (spies)
  * La classe `Answer` n’est PAS remplacée :
      → Le constructeur s’exécute normalement
      → L’état interne (`this._value`) est conservé

  🔹 Subtilité importante (accès au "private") :

  * La méthode `value()` est marquée `private` en TypeScript
  * MAIS :
      → Le mot-clé `private` est **uniquement une contrainte de typage**
      → Au runtime JavaScript, la méthode existe toujours sur le prototype
  * Résultat :
      → Vitest peut espionner `value()`
      → Le test peut appeler `instance.value()`
      → Le spy peut suivre les appels avec `toHaveBeenCalled()`

  👉 Autrement dit :
  * Le "private" TypeScript **n’empêche pas Vitest** d’observer la méthode
  * Le state privé (`_value`) reste encapsulé dans l’instance
  * Le spy est appliqué au **prototype**, pas à l’instance

  👉 Bonne pratique :

  * `spy: true` est idéal pour :
      → Observer des appels internes
      → Tester des classes utilisées indirectement
      → Vérifier des comportements sans casser l’encapsulation métier
*/

vi.mock(import('./example-4.ts'), { spy: true })

test('should access the private value of the class', () => {
    const instance = new Answer(10)
    expect(instance.value()).toBe(10)
    expect(instance.value).toHaveBeenCalled()

    const instance2 = new Answer(20)
    expect(instance2.value()).toBe(20)
    expect(instance2.value).toHaveBeenCalled()

    expect(Answer.prototype.value).toHaveBeenCalledTimes(2) // 👇
})

/*
  🔎 Prototype state & accumulation des appels :

  * Chaque instance (`instance`, `instance2`) possède **son propre état**
      → `_value` vaut 10 pour la première, 20 pour la seconde
  * En revanche, la méthode `value()` est définie sur le **prototype** de la classe

  👉 Conséquence importante :

  * Les appels à `instance.value()` et `instance2.value()` :
      → Sont comptabilisés **au même endroit**
      → `Answer.prototype.value`
  * Le prototype **accumule tous les appels**, quelle que soit l’instance

  💡 Pourquoi c’est puissant :

  * Permet de tracer des appels sur des instances :
      → Créées dynamiquement
      → Cachées dans une fonction interne
      → Jamais exposées directement au test
  * On peut vérifier :
      → Le nombre total d’appels
      → Les valeurs retournées
      → L’ordre des exécutions
    …sans avoir la main sur les instances elles-mêmes
*/
