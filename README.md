# 🤖 Clarity Bot

Un bot Discord moderne et complet avec **39 commandes** en français, développé avec Discord.js v14.

## ✨ Fonctionnalités

### 🎮 **Commandes Fun & Jeux** (8 commandes)
- `/8ball` - Pose une question à la boule magique
- `/capybara` - Calcule le pourcentage capybara d'un utilisateur
- `/fake-ban` - Simule un bannissement (faux)
- `/gay` - Calcule le pourcentage gay d'un utilisateur
- `/love` - Calcule la compatibilité amoureuse entre deux utilisateurs
- `/pile-face` - Lance une pièce (pile ou face)
- `/poli` - Test politique amusant
- `/scam` - Calcule le pourcentage scammer d'un utilisateur

### 👤 **Commandes Informations** (12 commandes)
- `/ping` - Affiche la latence du bot
- `/user-info` - Informations détaillées sur un utilisateur
- `/serveurinfo` - Informations détaillées sur le serveur
- `/members` - Statistiques des membres du serveur
- `/members-all` - Statistiques globales de tous les serveurs
- `/vc` - Statistiques vocales du serveur
- `/stat` - Statistiques complètes du bot
- `/uptime` - Temps de fonctionnement du bot
- `/pp` - Affiche l'avatar d'un utilisateur
- `/pp-server` - Affiche l'icône du serveur
- `/pp-random` - Affiche l'avatar d'un membre aléatoire
- `/banner` - Affiche la bannière d'un utilisateur

### 🛡️ **Commandes Modération** (13 commandes)
- `/ban` - Bannit un utilisateur du serveur
- `/kick` - Expulse un utilisateur du serveur
- `/mute` - Rend temporairement muet un utilisateur
- `/unmute` - Rend la parole à un utilisateur
- `/clear` - Supprime un nombre de messages
- `/prune` - Supprime les messages d'un utilisateur spécifique
- `/lock` - Verrouille le salon actuel
- `/unlock` - Déverrouille le salon actuel
- `/leck` - Cache un salon (le rend invisible)
- `/nuke` - Clone le salon actuel et supprime l'ancien
- `/supprimer` - Supprime le salon actuel
- `/rename` - Renomme le salon actuel
- `/snipe` - Affiche le dernier message supprimé

### 🎨 **Commandes Création** (2 commandes)
- `/embed` - Créateur d'embed interactif (en développement)
- `/say` - Fait parler le bot dans le salon

### 🔧 **Commandes Utilitaires** (3 commandes)
- `/timer` - Crée un minuteur personnalisé
- `/jeux` - Sélectionne un jeu à jouer
- `/invite-bot` - Génère des liens d'invitation pour un bot

### 📚 **Commande d'Aide**
- `/help` - Centre d'aide interactif avec navigation par catégories

## 🚀 Installation

### Prérequis
- Node.js v16.9.0 ou plus récent
- Un bot Discord avec les permissions appropriées

### Configuration

1. **Cloner le repository**
```bash
git clone https://github.com/ayka-667/Clarity-Bot.git
cd Clarity-Bot
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
Créez un fichier `.env` à la racine du projet :
```env
TOKEN=votre_token_discord_ici
GUILD_ID=votre_guild_id_ici
STATUS=DEVELOPMENT
STATUSBOT=Clarity Bot
DISCORDSTATUS=dnd
```

4. **Lancer le bot**
```bash
node index.js
```

## 🛠️ Technologies Utilisées

- **Discord.js v14** - Framework principal
- **Node.js** - Runtime JavaScript
- **Git** - Contrôle de version

## 📁 Structure du Projet

```
Clarity-Bot/
├── src/
│   ├── commands/          # Commandes slash
│   ├── events/            # Événements Discord
│   ├── buttons/           # Gestionnaires de boutons
│   └── util/              # Utilitaires et handlers
├── .env                   # Variables d'environnement (non versionné)
├── .gitignore            # Fichiers à ignorer
├── package.json          # Dépendances et scripts
└── README.md             # Documentation
```

## 🔧 Fonctionnalités Techniques

- **Système de commandes modulaire** - Facile à étendre
- **Gestion d'erreurs robuste** - Gestion complète des erreurs
- **Interface interactive** - Boutons et menus déroulants
- **Système de permissions** - Vérification des permissions utilisateur
- **Localisation française** - Toutes les commandes en français
- **Design moderne** - Embeds colorés avec emojis

## 📊 Statistiques

- **39 commandes** au total
- **5 catégories** de commandes
- **53 fichiers** de code
- **5956+ lignes** de code
- **100% français** - Interface entièrement localisée

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer la documentation
- Optimiser le code

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Développeur

Développé avec ❤️ par **ayka-667**

---

**Clarity Bot** - Votre bot Discord moderne et complet ! 🎉