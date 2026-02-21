# app-viewsliste — SPFx WebPart

Webpart SPFx (SharePoint Framework) affichant une **grille de cartes d'applications** ("app launcher") depuis une liste SharePoint, avec deux thèmes visuels (Blue / Pink).

## Prérequis

| Outil | Version recommandée |
|---|---|
| Node.js | 18.x (testé avec v18.20.8) |
| npm | 8.x ou supérieur |
| gulp CLI | `npm install -g gulp-cli` |

> ⚠️ SPFx 1.18.x requiert **Node.js 18**. Utilisez `nvm use 18` si vous avez plusieurs versions.

## Création de la liste SharePoint

Créez une liste nommée **`Applications`** (ou personnalisez le nom via le Property Pane) avec les colonnes suivantes :

| Colonne interne | Type | Obligatoire | Description |
|---|---|---|---|
| `Title` | Texte (1 ligne) | Oui | Nom de l'application |
| `Description` | Texte (multi-lignes) | Non | Sous-titre / description |
| `Url` | Lien hypertexte | Non | URL de l'application |
| `IconUrl` | Lien hypertexte | Non | URL de l'icône |
| `Theme` | Choix | Non | `Blue` ou `Pink` |
| `Order0` | Nombre | Non | Ordre d'affichage |
| `IsActive` | Oui/Non | Non | Afficher / masquer l'app |

> **Note** : SharePoint ne permet pas une colonne nommée `Order` (mot réservé). Utilisez `Order0` comme nom interne.

## Installation et développement

```bash
# Installer les dépendances
npm install

# Compiler en mode watch
gulp build

# Servir localement (workbench SharePoint)
gulp serve

# Créer le package .sppkg
gulp bundle --ship && gulp package-solution --ship
```

## Property Pane (configuration)

| Paramètre | Défaut | Description |
|---|---|---|
| Nom de la liste | `Applications` | Nom interne de la liste SharePoint |
| Ouvrir dans un nouvel onglet | `true` | Cible des liens (`_blank` ou `_self`) |
| Filtrer les applications actives | `true` | N'affiche que les items avec `IsActive = true` |

## Fonctionnement dynamique

- Ajouter/supprimer/modifier un item dans la liste met à jour l'affichage **sans modifier le code** (après rafraîchissement de la page).
- Chaque carte affiche : icône, titre, description, bouton "Ouvrir".
- Deux thèmes visuels selon le champ `Theme` : **Blue** (bleu Microsoft) et **Pink** (rose/violet).

## Structure du projet

```
src/
  webparts/
    viewsListe/
      ViewsListeWebPart.ts          # WebPart principal
      ViewsListeWebPart.manifest.json
      components/
        ViewsListe.tsx              # Composant React
        ViewsListe.module.scss      # Styles CSS Modules
        ViewsListe.module.scss.d.ts # Déclarations TypeScript pour les styles
        IViewsListeProps.ts         # Interface des props
        IAppItem.ts                 # Interface des items de liste
      loc/
        en-us.js                    # Chaînes de localisation
        mystrings.d.ts
config/
  config.json
  package-solution.json
  serve.json
```