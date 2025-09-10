# Palette de Couleurs Clarity Bot

## Vue d'ensemble

Le bot Discord Clarity utilise une palette de couleurs chaleureuse et professionnelle avec des tons terreux et crème, créant une ambiance sophistiquée et moderne.

## Palette Principale

### Couleurs de Base
- **Primary** (`#f4e4c1`) - Crème clair pour les titres et accents principaux
- **Secondary** (`#e6d3a3`) - Beige crème pour les descriptions
- **Text** (`#f8f4e6`) - Crème très clair pour le texte principal
- **Border** (`#f0e6d2`) - Crème transparent pour les bordures

### Couleurs d'État
- **Success** (`#c8e6c8`) - Vert crème pour les actions réussies
- **Warning** (`#f4d03f`) - Jaune pâle pour les avertissements
- **Error** (`#d4a574`) - Marron doré pour les erreurs
- **Info** (`#d4c4a8`) - Beige doré pour les informations

### Couleurs Spéciales
- **Accent** (`#e8d5b7`) - Crème accent pour les éléments spéciaux

## Utilisation

### Importation
```javascript
const { colors } = require("../config/colors");
```

### Exemples d'utilisation

#### Embeds principaux
```javascript
const embed = new EmbedBuilder()
  .setColor(colors.primary)
  .setTitle("Titre principal")
  .setDescription("Description en beige crème");
```

#### Embeds de succès
```javascript
const embed = new EmbedBuilder()
  .setColor(colors.success)
  .setTitle("✅ Succès !")
  .setDescription("Action réussie");
```

#### Embeds d'erreur
```javascript
const embed = new EmbedBuilder()
  .setColor(colors.error)
  .setTitle("❌ Erreur !")
  .setDescription("Une erreur s'est produite");
```

#### Embeds d'avertissement
```javascript
const embed = new EmbedBuilder()
  .setColor(colors.warning)
  .setTitle("⚠️ Attention !")
  .setDescription("Avertissement important");
```

### Couleurs par Catégorie

Les commandes sont organisées par catégories avec des couleurs spécifiques :

- **Fun & Jeux** : `colors.categories.fun` (Crème clair)
- **Informations** : `colors.categories.info` (Beige doré)
- **Modération** : `colors.categories.mod` (Marron doré)
- **Création** : `colors.categories.create` (Crème accent)
- **Utilitaires** : `colors.categories.util` (Beige crème)

### Fonctions Utilitaires

#### Obtenir une couleur par type
```javascript
const { getColorByType } = require("../config/colors");

const successColor = getColorByType('success'); // Retourne colors.success
const errorColor = getColorByType('error');     // Retourne colors.error
```

#### Couleur aléatoire
```javascript
const { getRandomColor } = require("../config/colors");

const randomColor = getRandomColor(); // Retourne une couleur aléatoire de la palette
```

#### Conversion hexadécimale
```javascript
const { hexToDecimal } = require("../config/colors");

const decimalColor = hexToDecimal('#f4e4c1'); // Retourne 16042945
```

## Cohérence du Thème

### Principes de Design
1. **Ambiance chaleureuse** : Utilisez des tons crème et beige
2. **Contraste élevé** : Assurez-vous que le texte reste lisible
3. **Professionnalisme** : Évitez les couleurs trop vives ou flashy
4. **Cohérence** : Utilisez toujours les couleurs de la palette

### Bonnes Pratiques
- Utilisez `colors.primary` pour les embeds principaux
- Utilisez `colors.success` pour les confirmations
- Utilisez `colors.error` pour les erreurs
- Utilisez `colors.warning` pour les avertissements
- Utilisez `colors.info` pour les informations générales

### Éviter
- Ne pas utiliser de couleurs hardcodées (comme `0x5865f2`)
- Ne pas mélanger avec d'anciennes palettes
- Ne pas utiliser de couleurs trop vives ou contrastées

## Mise à Jour

Pour ajouter de nouvelles couleurs à la palette :

1. Ajoutez la couleur dans `src/config/colors.js`
2. Documentez-la dans ce fichier
3. Mettez à jour les exemples d'utilisation
4. Testez la cohérence visuelle

## Support

Pour toute question sur l'utilisation de la palette de couleurs, consultez ce fichier ou contactez l'équipe de développement.
