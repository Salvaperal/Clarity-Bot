/**
 * Configuration des couleurs pour le bot Discord Clarity
 * Palette chaleureuse et professionnelle avec tons terreux
 */

const colors = {
  // EMBEDS PRINCIPAUX - Titres et accents
  primary: 0xf4e4c1, // #f4e4c1 - Crème clair
  
  // EMBEDS SECONDAIRES - Descriptions
  secondary: 0xe6d3a3, // #e6d3a3 - Beige crème
  
  // COULEURS D'ÉTAT
  success: 0xc8e6c8, // #c8e6c8 - Vert crème
  warning: 0xf4d03f, // #f4d03f - Jaune pâle
  error: 0xd4a574,   // #d4a574 - Marron doré
  
  // TEXTE PRINCIPAL
  text: 0xf8f4e6,    // #f8f4e6 - Crème très clair
  
  // BORDURES - Tons crème transparents
  border: 0xf0e6d2,  // #f0e6d2 - Crème transparent
  
  // COULEURS SPÉCIALES
  info: 0xd4c4a8,    // #d4c4a8 - Beige doré pour les informations
  accent: 0xe8d5b7,  // #e8d5b7 - Crème accent
  
  // COULEURS PAR DÉFAUT (fallback)
  default: 0xf4e4c1, // #f4e4c1 - Crème clair par défaut
  
  // COULEURS POUR LES CATÉGORIES DE COMMANDES
  categories: {
    fun: 0xf4e4c1,      // Fun & Jeux - Crème clair
    info: 0xd4c4a8,      // Informations - Beige doré
    mod: 0xd4a574,       // Modération - Marron doré
    create: 0xe8d5b7,    // Création - Crème accent
    util: 0xe6d3a3       // Utilitaires - Beige crème
  },
  
  // COULEURS POUR LES BOUTONS
  buttons: {
    primary: 0xf4e4c1,   // Boutons principaux
    secondary: 0xe6d3a3, // Boutons secondaires
    success: 0xc8e6c8,   // Boutons de succès
    danger: 0xd4a574,    // Boutons de danger
    warning: 0xf4d03f    // Boutons d'avertissement
  }
};

/**
 * Convertit une couleur hexadécimale en nombre décimal
 * @param {string} hex - Couleur hexadécimale (ex: "#f4e4c1")
 * @returns {number} - Couleur en format décimal
 */
function hexToDecimal(hex) {
  return parseInt(hex.replace('#', ''), 16);
}

/**
 * Obtient une couleur avec transparence
 * @param {string|number} color - Couleur de base
 * @param {number} alpha - Niveau de transparence (0-1)
 * @returns {number} - Couleur avec transparence
 */
function withAlpha(color, alpha = 0.8) {
  const baseColor = typeof color === 'string' ? hexToDecimal(color) : color;
  // Pour Discord, on ne peut pas vraiment faire de transparence, 
  // mais on peut utiliser des couleurs plus claires
  return Math.floor(baseColor * alpha);
}

/**
 * Obtient une couleur aléatoire de la palette
 * @returns {number} - Couleur aléatoire
 */
function getRandomColor() {
  const colorValues = Object.values(colors).filter(val => typeof val === 'number');
  return colorValues[Math.floor(Math.random() * colorValues.length)];
}

/**
 * Obtient une couleur basée sur le type de message
 * @param {string} type - Type de message ('success', 'error', 'warning', 'info')
 * @returns {number} - Couleur appropriée
 */
function getColorByType(type) {
  const typeMap = {
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    default: colors.primary
  };
  
  return typeMap[type] || colors.primary;
}

module.exports = {
  colors,
  hexToDecimal,
  withAlpha,
  getRandomColor,
  getColorByType
};
