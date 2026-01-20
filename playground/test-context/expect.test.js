import { it } from 'vitest'

/*
  EXPECT - Ce test illustre l'utilisation de `expect` fourni par le **contexte du test** 
  pour assurer l'isolation des assertions, notamment en cas de tests concurrents.

  ✅ Fonctionnement :

  * Le `expect` passé dans le contexte du test est **différent du expect global** :
    - `globalThis.expect` = l'instance globale de Vitest
    - `expect` injecté = instance isolée pour ce test
  * Vérification : `globalThis.expect === expect` → false, garantissant l'isolation

  🔹 Utilité :

  * Permet de sécuriser les tests concurrents (`it.concurrent`) sans collision d’assertions
  * Chaque test dispose de sa propre instance `expect` pour :
    - Assertions
    - Snapshots (inline ou fichiers)
  * Évite les conditions de course et les conflits de snapshot

  ⚠️ Points d’attention :

  * Cette isolation n’est nécessaire que pour les tests **concurrents ou complexes**
  * Pour les tests simples et séquentiels, expect global peut suffire
  * Toujours utiliser l’`expect` du contexte pour snapshots afin d’éviter les collisions

  👉 Bonne pratique :

  * Utiliser `({ expect })` pour toutes les assertions dans des tests concurrents
  * Comparer éventuellement avec `globalThis.expect` pour debug ou vérification
  * Garantit des tests fiables, même avec des snapshots et parallélisation
  */

it('should global expect not be equal to context expect', ({ expect }) => {
    console.log('GLOBAL expect === CONTEXT expect ?', globalThis.expect === expect)
    expect(globalThis.expect === expect).toBe(false)
})