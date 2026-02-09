import { test as baseTest, expect } from 'vitest'

/*
════════════════════════════════════════════════════════════
SYNTAXE OBJET — Fixture "classique"
════════════════════════════════════════════════════════════

✅ Fonctionnement :

* La fixture est exécutée **uniquement si le test la demande**
  via la destructuration du contexte : ({ todos })
* Le cycle de vie est :
    - avant le test → code AVANT `use`
    - pendant le test → `use(value)`
    - après le test → code APRÈS `use`

⚠️ Limitations :

* Impossible d’utiliser :
    - auto: true
    - scope: 'file' | 'worker'
    - injected: true
* La fixture est **strictement par test**.

👉 Cas d’usage idéal :

* Fixtures simples
* Données propres à un test
* État isolé par test
*/
const test1 = baseTest.extend({
    todos: async ({ }, use) => {
        console.log("AVANT TEST1");
        await use([])
        console.log("APRES TEST1");
    }
})

test1('should log before and after fixture without the need to inject it', ({todos}) => {
    expect(todos).toEqual([])
})

/*
════════════════════════════════════════════════════════════
SYNTAXE TABLEAU — Fixture avancée (auto / scope / injected)
════════════════════════════════════════════════════════════

✅ Fonctionnement :

* Permet de configurer le **comportement de la fixture** :
    - auto: true → exécutée même si le test ne la demande pas
    - scope: 'file' | 'worker' → partage du contexte
    - injected: true → surcharge via les projects
* La fixture peut être utilisée :
    - comme simple hook (setup / teardown)
    - ou comme fournisseur de valeur

⚠️ Point important :

* Si la fixture est automatique (`auto: true`) **et non injectée dans le test** :
    - elle s’exécute quand même
    - MAIS aucune valeur n’est récupérable dans le test
* Pour accéder à une valeur, il faut :
    - soit la demander dans le callback
    - soit utiliser une variable en dehors de la fixture

👉 Cas d’usage idéal :

* Hooks globaux (logs, mocks, setup/teardown)
* Initialisation obligatoire
* Setup coûteux ou transverse
*/

const test2 = baseTest.extend({
    fixture: [
        async ({ }, use) => {
            console.log('AVANT TEST2')
            await use()
            console.log('APRES TEST2')
        },
        { auto: true }
    ],
})

test2('should log before and after TEST2 without the need to inject it', () => {
    expect(true).toBe(true)
})

/*
════════════════════════════════════════════════════════════
SYNTAXE VALEUR DIRECTE — Fixture simple injectée
════════════════════════════════════════════════════════════

✅ Fonctionnement :

* La valeur est injectée dans le contexte du test
* Pas de cycle de vie (pas de setup / teardown)
* Très lisible et très simple

⚠️ Limitations :

* Pas de logique asynchrone
* Pas de cleanup
* Pas de scope ni auto

👉 Cas d’usage idéal :

* Configuration
* Constantes de test
* Valeurs dépendantes du projet (avec injected: true)
*/

const test3 = baseTest.extend({
    url: '/default'
})

test3('should get the default url from injection', ({ url }) => {
    expect(url).toBe('/default')
})