import { vi, it, expect, describe } from 'vitest'

/*
📌 vi.stubEnv / vi.unstubAllEnvs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 Fonctionnement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- vi.stubEnv permet de modifier temporairement une variable d’environnement
  à la fois dans :
  - process.env
  - import.meta.env
- Vitest mémorise la valeur originale **lors du premier stubEnv**
- vi.unstubAllEnvs restaure toutes les variables stubées à leur état initial

👉 Contrairement à une simple affectation (`process.env.X = ...`),
   Vitest garde une trace interne des changements.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 Utilisation dans ces tests
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Test 1 :
  - Vérifie la valeur initiale de NODE_ENV ("test")
  - Stub NODE_ENV en "production"
  - Vérifie que la nouvelle valeur est bien appliquée

- Test 2 :
  - Stub NODE_ENV en "production"
  - Vérifie la valeur modifiée
  - Appelle vi.unstubAllEnvs()
  - Vérifie que NODE_ENV revient à sa valeur d’origine ("test")

👉 La valeur restaurée correspond à celle **avant le premier stubEnv**,
   pas à la dernière valeur définie.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Points d’attention
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- vi.stubEnv est cumulatif :
  plusieurs appels successifs écrasent la valeur,
  mais la valeur originale reste celle du tout premier appel
- vi.unstubAllEnvs restaure **toutes** les variables stubées,
  pas uniquement une variable spécifique
- Si tu modifies directement process.env sans stubEnv :
  ❌ impossible de restaurer automatiquement


━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Bonnes pratiques
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Toujours utiliser vi.stubEnv plutôt que process.env.X =
- Appeler vi.unstubAllEnvs dans un afterEach ou un test dédié
- Utiliser stubEnv pour tester :
  - des branches conditionnelles (DEV / PROD)
  - des comportements dépendants du runtime
  - des flags de configuration
- Éviter de dépendre de l’environnement réel de la machine de test

💡 Règle d’or :
Si tu veux modifier une variable d’environnement **dans un test**,
utilise toujours vi.stubEnv.
*/

describe('vi.stubEnv', () => {
    it('should stub env variables', () => {
        expect(process.env.NODE_ENV).toBe('test')
        vi.stubEnv('NODE_ENV', 'production')
        expect(process.env.NODE_ENV).toBe('production')
    })

    it('should unstub env variables', () => {
        vi.stubEnv('NODE_ENV', 'production')
        expect(process.env.NODE_ENV).toBe('production')

        vi.unstubAllEnvs()
        expect(process.env.NODE_ENV).toBe('test')
    })
})