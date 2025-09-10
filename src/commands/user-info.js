const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { colors } = require("../config/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user-info")
    .setDescription("👤 Affiche les informations détaillées d'un utilisateur")
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("👤 L'utilisateur dont vous voulez voir les informations")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("utilisateur") || interaction.user;
    
    try {
      // Récupérer le membre du serveur
      const guildMember = await interaction.guild.members.fetch({ user, force: true }).catch(() => null);
      const joinedDate = guildMember ? guildMember.joinedAt : null;
      const formattedJoinedDate = joinedDate ? `<t:${Math.floor(joinedDate.getTime() / 1000)}:F>` : '*Aucune donnée*';
      
      // Récupérer la bannière
      const fullUser = await client.users.fetch(user.id, { force: true });
      const bannerURL = fullUser.bannerURL({ dynamic: true, size: 4096 });
      
      // Compter les serveurs en commun
      const guildsInCommon = client.guilds.cache.filter(guild => 
        guild.members.cache.some(member => member.id === user.id)
      );
      const guildsInCommonCount = guildsInCommon.size;
      
      // Rôles du membre
      const roles = guildMember ? guildMember.roles.cache
        .filter(role => role.id !== interaction.guild.id)
        .sort((a, b) => b.position - a.position)
        .map(role => role.toString())
        .slice(0, 10) : [];
      
      // Statut de présence
      const presence = guildMember?.presence;
      const status = presence?.status || 'offline';
      const activities = presence?.activities || [];
      const customStatus = activities.find(activity => activity.type === 4);
      
      // Badges
      const flags = user.flags?.toArray() || [];
      const badges = flags.map(flag => {
        const badgeMap = {
          'Staff': '👨‍💼',
          'Partner': '🤝',
          'Hypesquad': '🎉',
          'BugHunterLevel1': '🐛',
          'BugHunterLevel2': '🐛',
          'HypesquadOnlineHouse1': '⚡',
          'HypesquadOnlineHouse2': '💎',
          'HypesquadOnlineHouse3': '🎭',
          'PremiumEarlySupporter': '💎',
          'TeamPseudoUser': '👥',
          'VerifiedBot': '✅',
          'VerifiedDeveloper': '👨‍💻',
          'CertifiedModerator': '🛡️',
          'BotHTTPInteractions': '🤖',
          'ActiveDeveloper': '⚡'
        };
        return badgeMap[flag] || '🏆';
      });

      const embed = new EmbedBuilder()
        .setColor(colors.primary)
        .setTitle(`👤 Informations sur ${user.username}`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
        .setDescription(`Voici les informations détaillées de **${user.username}** !`)
        .addFields(
          {
            name: "👤 **Informations principales**",
            value: `**Tag :** ${user.tag}\n**ID :** \`${user.id}\`\n**Bot :** ${user.bot ? "Oui" : "Non"}\n**Badges :** ${badges.join(' ') || 'Aucun'}`,
            inline: false
          },
          {
            name: "📅 **Dates**",
            value: `**Compte créé :** <t:${Math.floor(user.createdTimestamp / 1000)}:F>\n**A rejoint :** ${formattedJoinedDate}`,
            inline: true
          },
          {
            name: "🌍 **Serveurs**",
            value: `**En commun :** ${guildsInCommonCount} serveur(s)`,
            inline: true
          },
          {
            name: "📊 **Statut**",
            value: `**Status :** ${status}\n**Activité :** ${customStatus ? customStatus.state || 'Aucune' : 'Aucune'}`,
            inline: true
          }
        )
        .setFooter({ 
          text: `Demandé par ${interaction.user.username}`, 
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
        })
        .setTimestamp();

      // Ajouter les rôles si disponibles
      if (roles.length > 0) {
        embed.addFields({
          name: "🎭 **Rôles**",
          value: roles.join(' ') + (roles.length === 10 ? '\n*...et plus*' : ''),
          inline: false
        });
      }

      // Ajouter la bannière si disponible
      if (bannerURL) {
        embed.setImage(bannerURL);
      }

      await interaction.reply({
        embeds: [embed]
      });

    } catch (error) {
      console.error("Erreur lors de la récupération des informations utilisateur :", error);
      await interaction.reply({
        content: "❌ Une erreur s'est produite lors de la récupération des informations utilisateur !",
        ephemeral: true
      });
    }
  },
};
