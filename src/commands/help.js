const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("📚 Affiche la liste des commandes disponibles du bot")
    .addStringOption((option) =>
      option
        .setName("categorie")
        .setDescription("🔍 Choisissez une catégorie de commandes")
        .setRequired(false)
        .addChoices(
          { name: "🎮 Fun & Jeux", value: "fun" },
          { name: "👤 Informations", value: "info" },
          { name: "🛡️ Modération", value: "mod" },
          { name: "🎨 Création", value: "create" },
          { name: "🔧 Utilitaires", value: "util" }
        )
    ),

  async execute(interaction, client) {
    try {
      // Différer la réponse pour éviter l'expiration de l'interaction
      await interaction.deferReply();
      
      const category = interaction.options.getString("categorie");

    // Couleurs pour chaque catégorie
    const colors = {
      fun: 0xff6b6b,
      info: 0x4ecdc4,
      mod: 0xff4757,
      create: 0x5f27cd,
      util: 0x00d2d3,
      default: 0x5865f2
    };

    // Commandes par catégorie
    const commands = {
      fun: [
        { name: "8ball", description: "🎱 Pose une question à la boule magique", usage: "/8ball <question>" },
        { name: "capybara", description: "🦫 Calcule le pourcentage capybara d'un utilisateur", usage: "/capybara [utilisateur]" },
        { name: "fake-ban", description: "🎭 Simule un bannissement (faux)", usage: "/fake-ban <utilisateur> [raison]" },
        { name: "gay", description: "🏳️‍🌈 Calcule le pourcentage gay d'un utilisateur", usage: "/gay [utilisateur]" },
        { name: "love", description: "💕 Calcule la compatibilité amoureuse entre deux utilisateurs", usage: "/love <utilisateur1> <utilisateur2>" },
        { name: "pile-face", description: "🪙 Lance une pièce (pile ou face)", usage: "/pile-face" },
        { name: "poli", description: "🗳️ Test politique amusant", usage: "/poli [utilisateur]" },
        { name: "scam", description: "🚨 Calcule le pourcentage scammer d'un utilisateur", usage: "/scam [utilisateur]" }
      ],
      info: [
        { name: "ping", description: "🏓 Affiche la latence du bot", usage: "/ping" },
        { name: "user-info", description: "👤 Informations détaillées sur un utilisateur", usage: "/user-info [utilisateur]" },
        { name: "serveurinfo", description: "🏰 Informations détaillées sur le serveur", usage: "/serveurinfo" },
        { name: "members", description: "👥 Statistiques des membres du serveur", usage: "/members" },
        { name: "members-all", description: "🌍 Statistiques globales de tous les serveurs", usage: "/members-all" },
        { name: "vc", description: "🎤 Statistiques vocales du serveur", usage: "/vc" },
        { name: "stat", description: "📊 Statistiques complètes du bot", usage: "/stat" },
        { name: "uptime", description: "⏰ Temps de fonctionnement du bot", usage: "/uptime" },
        { name: "pp", description: "🖼️ Affiche l'avatar d'un utilisateur", usage: "/pp [utilisateur]" },
        { name: "pp-server", description: "🏰 Affiche l'icône du serveur", usage: "/pp-server" },
        { name: "pp-random", description: "🎲 Affiche l'avatar d'un membre aléatoire", usage: "/pp-random" },
        { name: "banner", description: "🖼️ Affiche la bannière d'un utilisateur", usage: "/banner [utilisateur]" }
      ],
      mod: [
        { name: "ban", description: "🔨 Bannit un utilisateur du serveur", usage: "/ban <utilisateur> [raison]", perm: "Bannir des membres" },
        { name: "kick", description: "👢 Expulse un utilisateur du serveur", usage: "/kick <utilisateur> [raison]", perm: "Expulser des membres" },
        { name: "mute", description: "🔇 Rend temporairement muet un utilisateur", usage: "/mute <utilisateur> <durée> [raison]", perm: "Modérer des membres" },
        { name: "unmute", description: "🔊 Rend la parole à un utilisateur", usage: "/unmute <utilisateur> [raison]", perm: "Modérer des membres" },
        { name: "clear", description: "🧹 Supprime un nombre de messages", usage: "/clear <nombre> [utilisateur]", perm: "Modérer des membres" },
        { name: "prune", description: "🧹 Supprime les messages d'un utilisateur spécifique", usage: "/prune <utilisateur> <nombre>", perm: "Gérer les messages" },
        { name: "lock", description: "🔒 Verrouille le salon actuel", usage: "/lock [raison]", perm: "Gérer les salons" },
        { name: "unlock", description: "🔓 Déverrouille le salon actuel", usage: "/unlock [raison]", perm: "Gérer les salons" },
        { name: "leck", description: "👁️ Cache un salon (le rend invisible)", usage: "/leck <salon> [raison]", perm: "Gérer les salons" },
        { name: "nuke", description: "💥 Clone le salon actuel et supprime l'ancien", usage: "/nuke [raison]", perm: "Administrateur" },
        { name: "supprimer", description: "🗑️ Supprime le salon actuel", usage: "/supprimer [raison]", perm: "Administrateur" },
        { name: "rename", description: "📝 Renomme le salon actuel", usage: "/rename <nom>", perm: "Gérer les salons" },
        { name: "snipe", description: "🎯 Affiche le dernier message supprimé", usage: "/snipe", perm: "Gérer les messages" }
      ],
      create: [
        { name: "embed", description: "🎨 Créateur d'embed interactif (en développement)", usage: "/embed", perm: "Gérer les salons" },
        { name: "say", description: "💬 Fait parler le bot dans le salon", usage: "/say <message>", perm: "Gérer les messages" }
      ],
      util: [
        { name: "timer", description: "⏰ Crée un minuteur personnalisé", usage: "/timer <durée>", perm: "Gérer les messages" },
        { name: "jeux", description: "🎮 Sélectionne un jeu à jouer", usage: "/jeux" },
        { name: "invite-bot", description: "🤖 Génère des liens d'invitation pour un bot", usage: "/invite-bot <bot>" }
      ]
    };

    // Fonction pour créer un embed de catégorie
    function createCategoryEmbed(catName, catCommands, color) {
      const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(`📚 ${catName} - Commandes Clarity`)
        .setDescription(`Voici toutes les commandes disponibles dans la catégorie **${catName}** :`)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .setFooter({ 
          text: `Clarity Bot • ${catCommands.length} commande(s)`, 
          iconURL: client.user.displayAvatarURL({ dynamic: true }) 
        })
        .setTimestamp();

      // Ajouter les commandes par groupes de 5
      for (let i = 0; i < catCommands.length; i += 5) {
        const commandGroup = catCommands.slice(i, i + 5);
        const fieldValue = commandGroup.map(cmd => {
          let text = `**\`${cmd.name}\`** - ${cmd.description}\n*Usage: ${cmd.usage}*`;
          if (cmd.perm) text += `\n*Permission: ${cmd.perm}*`;
          return text;
        }).join('\n\n');
        
        embed.addFields({
          name: `📋 **Groupe ${Math.floor(i/5) + 1}**`,
          value: fieldValue,
          inline: false
        });
      }

      return embed;
    }

    // Fonction pour créer l'embed principal
    function createMainEmbed() {
      const totalCommands = Object.values(commands).reduce((acc, cat) => acc + cat.length, 0);
      
      const embed = new EmbedBuilder()
        .setColor(colors.default)
        .setTitle("📚 Centre d'aide Clarity Bot")
        .setDescription(`**Bienvenue dans le centre d'aide de Clarity Bot !**\n\nJe suis un bot Discord moderne avec **${totalCommands} commandes** réparties en **5 catégories**.\n\nUtilisez le menu déroulant ci-dessous pour explorer les commandes par catégorie, ou utilisez \`/help <categorie>\` pour une catégorie spécifique.`)
        .addFields(
          {
            name: "🎮 **Fun & Jeux**",
            value: `${commands.fun.length} commandes\n*8ball, capybara, love, pile-face...*`,
            inline: true
          },
          {
            name: "👤 **Informations**",
            value: `${commands.info.length} commandes\n*ping, user-info, serveurinfo...*`,
            inline: true
          },
          {
            name: "🛡️ **Modération**",
            value: `${commands.mod.length} commandes\n*ban, kick, mute, clear...*`,
            inline: true
          },
          {
            name: "🎨 **Création**",
            value: `${commands.create.length} commandes\n*embed, say...*`,
            inline: true
          },
          {
            name: "🔧 **Utilitaires**",
            value: `${commands.util.length} commandes\n*timer, jeux, invite-bot...*`,
            inline: true
          },
          {
            name: "💡 **Conseils d'utilisation**",
            value: "• Utilisez `/help <categorie>` pour une catégorie spécifique\n• Les commandes avec 🔒 nécessitent des permissions\n• Toutes les commandes sont en français\n• Utilisez l'autocomplétion pour plus de facilité",
            inline: false
          }
        )
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .setImage("https://cdn.discordapp.com/attachments/1234567890/help-banner.png") // Remplacez par votre image
        .setFooter({ 
          text: `Clarity Bot • ${totalCommands} commandes disponibles`, 
          iconURL: client.user.displayAvatarURL({ dynamic: true }) 
        })
        .setTimestamp();

      return embed;
    }

    // Créer les boutons
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("help_fun")
          .setLabel("🎮 Fun")
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId("help_info")
          .setLabel("👤 Info")
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId("help_mod")
          .setLabel("🛡️ Mod")
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId("help_create")
          .setLabel("🎨 Création")
          .setStyle(1),
        new ButtonBuilder()
          .setCustomId("help_util")
          .setLabel("🔧 Utils")
          .setStyle(1)
      );

    // Répondre selon la catégorie demandée
    if (category) {
      const categoryNames = {
        fun: "Fun & Jeux",
        info: "Informations", 
        mod: "Modération",
        create: "Création",
        util: "Utilitaires"
      };

      const embed = createCategoryEmbed(categoryNames[category], commands[category], colors[category]);
      await interaction.editReply({ embeds: [embed] });
    } else {
      const embed = createMainEmbed();
      await interaction.editReply({ embeds: [embed], components: [row] });

      // Gestion des boutons
      const collector = interaction.channel.createMessageComponentCollector({ 
        filter: (i) => i.user.id === interaction.user.id,
        time: 300000 
      });

      collector.on("collect", async (i) => {
        try {
          // Vérifier si l'interaction est encore valide
          if (i.ephemeral || i.replied || i.deferred) {
            return;
          }

          await i.deferUpdate();

          const buttonCategory = i.customId.replace("help_", "");
          const categoryNames = {
            fun: "Fun & Jeux",
            info: "Informations",
            mod: "Modération", 
            create: "Création",
            util: "Utilitaires"
          };

          const embed = createCategoryEmbed(categoryNames[buttonCategory], commands[buttonCategory], colors[buttonCategory]);
          await i.editReply({ embeds: [embed], components: [row] });
        } catch (error) {
          console.error("Erreur lors de la gestion du bouton help:", error);
          // Ne pas essayer de répondre si l'interaction a déjà été gérée
        }
      });

      collector.on("end", () => {
        const disabledRow = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId("help_fun")
              .setLabel("🎮 Fun")
              .setStyle(1)
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId("help_info")
              .setLabel("👤 Info")
              .setStyle(1)
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId("help_mod")
              .setLabel("🛡️ Mod")
              .setStyle(1)
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId("help_create")
              .setLabel("🎨 Création")
              .setStyle(1)
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId("help_util")
              .setLabel("🔧 Utils")
              .setStyle(1)
              .setDisabled(true)
          );

        interaction.editReply({ components: [disabledRow] }).catch(() => {});
      });
    }
    } catch (error) {
      console.error("Erreur dans la commande help:", error);
      try {
        await interaction.editReply({ 
          content: "❌ Une erreur s'est produite lors de l'exécution de la commande help." 
        });
      } catch (editError) {
        console.error("Impossible d'éditer la réponse:", editError);
      }
    }
  },
};
