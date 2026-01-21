import { add, fetchSomething } from './example'
import { vi, it, expect } from 'vitest'

/*
  Ce fichier illustre DEUX usages distincts de `vi.mocked` :
  1️⃣ Mock complet avec typage strict
  2️⃣ Mock partiel avec typage volontairement assoupli

  IMPORTANT :
  `vi.mocked` sert UNIQUEMENT à dire à TypeScript :
  👉 “cet export est bien un mock Vitest, fais-moi confiance”.

  ------------------------------------------------------------------
  🟢 CAS 1 — Mock complet avec typage strict
  ------------------------------------------------------------------

  vi.mocked(add).mockReturnValue(10)

  ✅ Fonctionnement :

  * `vi.mock('./example')` transforme `add` en mock AU RUNTIME
  * Mais TypeScript continue de voir `add` comme :
        (x: number, y: number) => number
  * `vi.mocked(add)` force TypeScript à considérer `add`
    comme un mock Vitest (MockInstance)

  👉 Résultat :
  * Accès autorisé à :
      - mockReturnValue
      - toHaveBeenCalled
      - toHaveBeenCalledWith
  * Typage STRICT conservé :
      - retour : number
      - paramètres : number, number

  ✔️ Cas idéal :
  * Fonctions pures
  * Logique métier
  * Tests avec forte garantie de typage


  ------------------------------------------------------------------
  🟠 CAS 2 — Mock partiel avec typage relâché
  ------------------------------------------------------------------

  vi.mocked(fetchSomething, { partial: true })
    .mockResolvedValue({ ok: false })

  ✅ Fonctionnement :

  * fetchSomething retourne normalement :
        Promise<Response>
  * Le test n’a besoin que de `{ ok }`
  * `{ partial: true }` dit à TypeScript :
        “autorise un sous-ensemble du type attendu”

  👉 Résultat :
  * `{ ok: false }` devient valide
  * Sans `partial: true` → ERREUR TypeScript
  * Le mock reste fonctionnel pour le test

  ✔️ Cas idéal :
  * Tests rapides
  * Mocks HTTP simplifiés
  * Quand le test ne dépend que de quelques champs


  ------------------------------------------------------------------
  🧠 RÉSUMÉ MENTAL
  ------------------------------------------------------------------

  * vi.mock(...)        → remplace le module AU RUNTIME
  * vi.mocked(...)      → informe TypeScript que c’est un mock
  * partial: true       → typage volontairement incomplet
  * deep: true          → mock profond d’objets complexes
*/

vi.mock('./example')

it('1 + 1 equals 10', async () => {
  vi.mocked(add).mockReturnValue(10)
  add(1, 1)
  expect(add).toHaveBeenCalledWith(1, 1)
  expect(add(1, 1)).toBe(10)
})

it('mock return value with only partially correct typing', async () => {
  vi.mocked(fetchSomething).mockResolvedValue(new Response('hello'))
  vi.mocked(fetchSomething, { partial: true }).mockResolvedValue({ ok: false })
})