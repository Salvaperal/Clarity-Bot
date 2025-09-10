const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { colors } = require("../config/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vc")
    .setDescription("🎤 Affiche les statistiques vocales du serveur"),

  async execute(interaction, client) {
    const guild = interaction.guild;
    
    try {
      // Récupérer les membres
      await guild.members.fetch();
      const totalMembers = guild.memberCount;
      
      // Compter les membres en ligne
      const onlineMembers = guild.members.cache.filter(member => 
        member.presence?.status !== 'offline' && member.presence?.status !== undefined
      ).size;
      
      // Compter les membres en vocal
      const voiceChannels = guild.channels.cache.filter(channel => 
        channel.type === 2 || channel.type === 13 // GUILD_VOICE ou GUILD_STAGE_VOICE
      );
      
      let voiceMembers = 0;
      let streamingMembers = 0;
      let cameraMembers = 0;
      let mutedMembers = 0;
      
      for (const channel of voiceChannels.values()) {
        const members = channel.members;
        voiceMembers += members.size;
        
        for (const member of members.values()) {
          if (member.voice.streaming) streamingMembers++;
          if (member.voice.selfVideo) cameraMembers++;
          if (member.voice.mute || member.voice.selfMute) mutedMembers++;
        }
      }
      
      // Statistiques de boost
      const boostCount = guild.premiumSubscriptionCount;
      const boostLevel = guild.premiumTier;
      
      // Calculer les pourcentages
      const onlinePercentage = totalMembers > 0 ? Math.round((onlineMembers / totalMembers) * 100) : 0;
      const voicePercentage = totalMembers > 0 ? Math.round((voiceMembers / totalMembers) * 100) : 0;

      const embed = new EmbedBuilder()
        .setColor(colors.primary)
        .setTitle(`🎤 Statistiques Vocales - ${guild.name}`)
        .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
        .setDescription(`Voici les statistiques vocales du serveur **${guild.name}** !`)
        .addFields(
          {
            name: "👥 **Membres**",
            value: `**Total :** ${totalMembers}\n**En ligne :** ${onlineMembers} (${onlinePercentage}%)`,
            inline: true
          },
          {
            name: "🎤 **Vocal**",
            value: `**En vocal :** ${voiceMembers} (${voicePercentage}%)\n**Streaming :** ${streamingMembers}\n**Caméra :** ${cameraMembers}`,
            inline: true
          },
          {
            name: "🔇 **Audio**",
            value: `**Mute :** ${mutedMembers}\n**Salons vocaux :** ${voiceChannels.size}`,
            inline: true
          },
          {
            name: "🚀 **Boost**",
            value: `**Niveau :** ${boostLevel}\n**Boosts :** ${boostCount}`,
            inline: true
          },
          {
            name: "📊 **Activité**",
            value: `**${onlinePercentage}%** en ligne\n**${voicePercentage}%** en vocal`,
            inline: true
          },
          {
            name: "🎯 **Statut**",
            value: voiceMembers > 0 ? "🎵 Actif" : "😴 Calme",
            inline: true
          }
        )
        .setFooter({ 
          text: `Demandé par ${interaction.user.username}`, 
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
        })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed]
      });

    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques vocales :", error);
      await interaction.reply({
        content: "❌ Une erreur s'est produite lors de la récupération des statistiques vocales !",
        ephemeral: true
      });
    }
  },
};
