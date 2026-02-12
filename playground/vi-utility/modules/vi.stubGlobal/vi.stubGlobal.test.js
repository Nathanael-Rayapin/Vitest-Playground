import { vi, it, expect, describe, beforeEach, afterEach } from 'vitest'

/*
📌 vi.stubGlobal / vi.unstubAllGlobals

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 Fonctionnement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- vi.stubGlobal(name, value)
  ➜ Définit une propriété sur globalThis
  ➜ Vitest mémorise la valeur originale (si elle existait)

- vi.unstubAllGlobals()
  ➜ Restaure uniquement les globals modifiés via vi.stubGlobal
  ➜ Ne touche PAS aux modifications faites manuellement

Important :
Vitest ne traque que ce qu’il stub lui-même.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 Analyse de ton code
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ 1) Le stub est fait en dehors des tests :

    vi.stubGlobal('projectName', 'Vitest');

Il est exécuté une seule fois au chargement du fichier.
Donc :
- Le global existe avant chaque test
- afterEach appelle vi.unstubAllGlobals()
- Mais comme aucun test ne restub via vi.stubGlobal,
  il n’y a plus rien à restaurer après le premier reset

Ce comportement peut devenir piégeux.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 Test 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

expect(projectName).toBe('Vitest')

✔️ OK
La variable globale a été créée via stubGlobal.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 Test 2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

globalThis.projectName = "Test";

Tu modifies directement la variable globale.

⚠️ Ce changement :
- n’est PAS suivi par Vitest
- n’est PAS enregistré comme stub
- ne pourra PAS être restauré

Donc :
expect(projectName).toBe('Test') ✔️


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 Test 3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

expect(projectName).toBe('Test')

✔️ Exact.
Pourquoi ?

Parce que :
- Tu as modifié globalThis.projectName manuellement
- vi.unstubAllGlobals() ne restaure que
  les valeurs définies avec vi.stubGlobal
- La modification directe reste en mémoire

Donc l’état global fuit entre les tests.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Subtilité importante
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ton suite n’est PAS isolée.

Ordre réel :

1. stubGlobal → "Vitest"
2. Test 1 → OK
3. afterEach → unstubAllGlobals() → restaure état initial (probablement undefined)
4. Test 2 → projectName est peut-être undefined selon timing
   MAIS ici, comme le stub est hors test,
   le comportement dépend du moment exact du reset.

Ce pattern est fragile.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Bonne pratique recommandée
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Toujours stub dans beforeEach :

beforeEach(() => {
    vi.stubGlobal('projectName', 'Vitest');
});

afterEach(() => {
    vi.unstubAllGlobals();
});

Ainsi :
✔️ Isolation parfaite
✔️ Pas de fuite d’état
✔️ Tests déterministes


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 Règle d’or
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- vi.stubGlobal → Vitest peut restaurer
- globalThis.X = ... → Vitest ne peut pas restaurer
- Toujours stub dans beforeEach
- Toujours unstub dans afterEach


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Pourquoi utiliser stubGlobal ?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cas réels :
- Mock de window
- Mock de fetch
- Mock de crypto
- Mock de performance
- Simulation d’environnement navigateur dans Node

Exemple typique :

vi.stubGlobal('fetch', vi.fn());

Beaucoup plus propre que :

global.fetch = vi.fn();


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Résumé
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ton test montre parfaitement la subtilité :
Vitest ne restaure que ce qu’il contrôle.

C’est une différence fondamentale entre :
👉 patch contrôlé (stubGlobal)
et
👉 mutation directe (globalThis.X = ...)
*/

afterEach(() => {
    vi.unstubAllGlobals();
})

describe('vi.stubGlobal', () => {
    vi.stubGlobal('projectName', 'Vitest');

    it('should stub a global variable', () => {
        expect(projectName).toBe('Vitest')
    })

    it('should stub a global variable with a new value using globalThis', () => {
        globalThis.projectName = "Test";
        expect(projectName).toBe('Test')
    })

    it('should previous global variable be the same because it\'s not set with vitest so unstub dosn\'t work', () => {
        expect(projectName).toBe('Test')
    })
})