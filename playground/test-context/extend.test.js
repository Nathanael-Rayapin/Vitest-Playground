import { test as baseTest, expect, describe } from 'vitest'

/*
    FIXTURE - Ce setup montre comment créer une **fixture réinitialisée à chaque test**
    avec Vitest.

    ✅ Fonctionnement :

    * `todos` est un tableau partagé pour la suite de tests.
    * Avant chaque test :
        - `todos.push(1, 2, 3)` → on initialise le tableau avec des valeurs de base.
    * `await use(todos)` :
        - Passe le tableau au test courant.
        - Le test peut modifier `todos` sans impacter les autres tests.
    * Après le test :
        - `todos.length = 0` → nettoyage de la fixture, réinitialisation pour le test suivant.

    🔹 Utilité :

    * Garantit que chaque test démarre avec un état connu.
    * Permet d’éviter les effets de bord entre tests (tests isolés et fiables).
    * Très pratique pour des objets ou tableaux partagés, mocks ou ressources temporaires.

    ⚠️ Points d’attention :

    * Ne pas oublier de **nettoyer la fixture** pour éviter que les tests suivants soient pollués.
    * `await use(...)` est obligatoire : c’est ce qui permet au test d’accéder à la fixture.
    * Chaque test reçoit sa propre “vue” sur la fixture après setup.

    👉 Bonne pratique :

    * Utiliser ce pattern pour tous les tests qui manipulent des états partagés.
    * Toujours remettre la fixture à l’état initial après le test.
*/

const todos = []

const test = baseTest.extend({
    todos: async ({ }, use) => {
        // Setup la fixture avant chaque test
        todos.push(1, 2, 3)

        // Passe la fixture au test courant
        await use(todos)

        // Nettoyage après le test
        todos.length = 0
    }
})

describe('Default Todos', () => {
    test('should add items to todos', ({ todos }) => {
        expect(todos.length).toBe(3)
        todos.push(4)
        expect(todos.length).toBe(4)
    })

    test('should todo re-initialize to default', ({ todos }) => {
        expect(todos.length).toBe(3)
    })
})

/*
SCOPED OVERRIDE DE FIXTURE

test.scoped({ todos: [] })

✅ Fonctionnement :

* `test.scoped()` permet de **surcharger temporairement des fixtures**
  pour un bloc de tests (`describe`) uniquement.
* La surcharge est **limitée à ce scope** :
  - Elle s’applique à tous les tests contenus dans ce `describe`
  - Elle n’affecte PAS les autres `describe` ou tests du fichier
* Ici, la fixture `todos` est réinitialisée à un tableau vide
  avant chaque test du bloc.

🔹 Différence avec d’autres approches :

* ❌ Modifier directement la fixture globale → impacte tous les tests
* ❌ Réinitialiser manuellement dans chaque test → duplication de code
* ✅ `test.scoped()` → isolation propre, lisible et intention claire

🔹 Cas d’usage typiques :

* Tester des comportements avec un état initial spécifique
* Simuler des scénarios “vide”, “partiel”, “pré-rempli”
* Forcer une configuration sans toucher à la définition globale
* Éviter les effets de bord entre blocs de tests

⚠️ Points importants :

* La valeur passée à `scoped` remplace complètement la fixture
  (ce n’est pas un merge).
* La surcharge est appliquée **avant l’exécution des fixtures** du test.
* L’ordre d’appel de `test.scoped()` doit être **avant les tests du bloc**.

👉 Bonne pratique :

* Utiliser `test.scoped()` pour des variations locales de fixtures.
* Garder les fixtures globales comme source de vérité par défaut.
* Préférer `scoped` à des mutations manuelles dans les tests.
*/

describe('New Todos', () => {
    test.scoped({ todos: [] })

    test('should not contain items', ({ todos }) => {
        expect(todos.length).toBe(0)
    })
})


/*
FIXTURE AUTOMATIQUE - Exécution sans injection explicite dans le test.

Par défaut, une fixture n’est exécutée **que si le test la demande explicitement**
via le contexte :

test('without todos', () => {
  console.log('test running')
})

➡️ Ici, la fixture `todos` (ou toute autre fixture) ne serait PAS exécutée.

Vitest permet cependant de marquer une fixture comme **automatique** avec `{ auto: true }`.

✅ Fonctionnement :

* La fixture est exécutée **pour chaque test**, même si elle n’est pas injectée
  dans la signature du test.
* Le code avant `await use()` s’exécute **avant le test**.
* Le code après `await use()` s’exécute **après le test**, quoi qu’il arrive
  (succès, échec ou skip).

🔹 Utilité :

* Initialiser ou nettoyer un état global.
* Démarrer / arrêter un serveur, une base de données, un mock global.
* Logger automatiquement le cycle de vie des tests.
* Mettre en place des hooks transverses sans polluer la signature des tests.

⚠️ Points d’attention :

* Une fixture automatique s’exécute **toujours** → attention aux coûts
  (performance, I/O, réseau).
* Elle ne fournit pas de valeur au test (sauf usage interne).
* À utiliser pour des effets de bord globaux, pas pour des données métiers.

👉 Bonne pratique :

* Utiliser `{ auto: true }` pour des setups globaux et techniques.
* Préférer les fixtures classiques pour des données utilisées directement
  dans les tests.
*/

const newTest = baseTest.extend({
    fixture: [
        async ({ }, use) => {
            console.log('AVANT fixture')
            await use()
            console.log('APRES fixture')
        },
        { auto: true }
    ],
})

newTest('should log before and after fixture without the need to inject it', () => {
    expect(true).toBe(true)
})


/*
FIXTURE - Injection de valeur spécifique par projet.

✅ Fonctionnement :

* `url` est une fixture définie via `extend` avec la syntaxe tuple `[value, options]`.
* `{ injected: true }` indique que la fixture peut être **surchargée par la configuration du projet** dans `vitest.config.ts`.
* Lorsqu’on lance Vitest avec un projet particulier (`--project new`), la fixture `url` reçoit la valeur définie pour ce projet (`'/new'`).
* Le test reçoit cette fixture via le contexte : `({ url })`.

🔹 Utilité :

* Permet de tester le même test dans plusieurs environnements ou projets avec des valeurs différentes.
* Très pratique pour injecter des URLs, API keys ou chemins différents selon le projet (par exemple dev, staging, prod).
* Garantit que le test reste indépendant du projet par défaut et reflète bien l’environnement courant.

⚠️ Points d’attention :

* La valeur par défaut (`'/default'`) est utilisée si le projet ne surcharge pas la fixture.
* La surcharge se fait via `provide` dans `vitest.config.ts` pour chaque projet.
* Toujours récupérer la fixture via le contexte `{ url }`, elle n’est **pas disponible en variable globale**.

👉 Bonne pratique :

* Utiliser `injected: true` pour toutes les fixtures qui doivent être configurables par projet.
* S’assurer que les projets définissent la valeur correcte pour éviter des comportements inattendus.
*/

const newTest2 = baseTest.extend({
    url: [
        '/default',
        { injected: true }
    ]
})

newTest2('should expect to current url based on the project launch from sript', ({ url }) => {
    expect(url).toBe('/extend')
})


const newTest3 = baseTest.extend({
    perFile: [
        async ({ }, use) => {
            console.log('Init perFile')
            await use([])
        },
        { scope: 'file' }
    ],
})

/*
PER-FILE FIXTURE

Cette fixture utilise un **scope: 'file'**, ce qui signifie que :

✅ Fonctionnement :

* La fixture `perFile` est **initialisée une seule fois pour tout le fichier**.
* Elle est partagée entre tous les tests définis avec `newTest3` dans ce fichier.
* L’initialisation se fait **au premier test qui accède à la fixture**.
* Les mutations effectuées dans un test sont visibles dans les tests suivants.

Dans cet exemple :

* `newTest3 A` pousse la valeur `1` dans le tableau.
* `newTest3 B` récupère le **même tableau** et vérifie que l’état a bien été conservé.

🔍 Détail important :

* La fixture n’est PAS automatique ici :
  - Elle s’exécute uniquement parce que les tests demandent `{ perFile }`.
  - Sans destructuration de `perFile` dans le callback, la fixture ne serait jamais initialisée.

⚠️ Points d’attention :

* Le scope `file` introduit un **état partagé entre tests** :
  - À utiliser volontairement (cache, setup coûteux, données globales).
  - À éviter pour des tests devant rester totalement indépendants.
* L’ordre des tests devient significatif si l’état est muté.

👉 Cas d’usage typiques :

* Cache en mémoire
* Connexion ou client initialisé une seule fois
* Données de référence partagées
* Optimisation de setups lourds

👉 Bonne pratique :

* Documenter clairement l’intention d’un scope `file`.
* Éviter les mutations implicites ou les dépendances cachées entre tests.
*/

newTest3('newTest3 A', ({ perFile }) => {
    perFile.push(1)
})

newTest3('newTest3 B', ({ perFile }) => {
    expect(perFile).toEqual([1])
})
