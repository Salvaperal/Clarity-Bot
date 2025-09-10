const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { colors } = require("../config/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("🔇 Rend temporairement muet un utilisateur")
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("👤 L'utilisateur à rendre muet")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("duree")
        .setDescription("⏱️ Durée du mute (ex: 30s, 5m, 1h, 1d)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("📝 Raison du mute")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const user = interaction.options.getUser("utilisateur");
    const duration = interaction.options.getString("duree");
    const reason = interaction.options.getString("raison") || "Aucune raison donnée";
    
    try {
      // Fonction pour convertir la durée en millisecondes
      function parseDuration(duration) {
        const regex = /^(\d+)([smhd])$/i;
        const match = duration.match(regex);
        
        if (!match) return null;
        
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        
        switch (unit) {
          case 's': return value * 1000;
          case 'm': return value * 60 * 1000;
          case 'h': return value * 60 * 60 * 1000;
          case 'd': return value * 24 * 60 * 60 * 1000;
          default: return null;
        }
      }
      
      const durationMs = parseDuration(duration);
      
      if (!durationMs) {
        return interaction.reply({
          content: "❌ Format de durée invalide ! Utilisez : `30s`, `5m`, `1h`, `1d`",
          ephemeral: true
        });
      }
      
      if (durationMs > 2419200000) { // 28 jours
        return interaction.reply({
          content: "❌ La durée ne peut pas dépasser 28 jours !",
          ephemeral: true
        });
      }
      
      if (durationMs < 1000) {
        return interaction.reply({
          content: "❌ La durée doit être d'au moins 1 seconde !",
          ephemeral: true
        });
      }
      
      const member = await interaction.guild.members.fetch(user.id);
      
      // Vérifications
      if (user.id === interaction.user.id) {
        return interaction.reply({
          content: "❌ Vous ne pouvez pas vous rendre muet vous-même !",
          ephemeral: true
        });
      }
      
      if (user.id === interaction.guild.ownerId) {
        return interaction.reply({
          content: "❌ Vous ne pouvez pas rendre muet le propriétaire du serveur !",
          ephemeral: true
        });
      }
      
      if (member.isCommunicationDisabled()) {
        return interaction.reply({
          content: "❌ Cet utilisateur est déjà mute !",
          ephemeral: true
        });
      }
      
      // Vérifier la hiérarchie des rôles
      const executorMember = await interaction.guild.members.fetch(interaction.user.id);
      if (executorMember.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
        return interaction.reply({
          content: "❌ Vous ne pouvez pas rendre muet cette personne ! Votre rôle doit être plus élevé.",
          ephemeral: true
        });
      }
      
      // Convertir en format lisible
      const seconds = Math.floor(durationMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      let readableDuration = "";
      if (days > 0) readableDuration += `${days}j `;
      if (hours % 24 > 0) readableDuration += `${hours % 24}h `;
      if (minutes % 60 > 0) readableDuration += `${minutes % 60}m `;
      if (seconds % 60 > 0) readableDuration += `${seconds % 60}s`;
      
      // Mute l'utilisateur
      await member.timeout(durationMs, `${reason} (Mute par ${interaction.user.tag})`);
      
      // Envoyer un DM à l'utilisateur
      try {
        await user.send({
          content: `🔇 Vous avez été **mute** du serveur **${interaction.guild.name}** !\n**Durée :** ${readableDuration.trim()}\n**Raison :** ${reason}`
        });
      } catch (error) {
        // Ignorer si le DM échoue
      }
      
      const embed = new EmbedBuilder()
        .setColor(colors.warning)
        .setTitle("🔇 Mute réussi !")
        .setDescription(`**${user.username}** a été mute avec succès !`)
        .addFields(
          {
            name: "👤 **Utilisateur**",
            value: `${user} (${user.tag})`,
            inline: true
          },
          {
            name: "⏱️ **Durée**",
            value: readableDuration.trim(),
            inline: true
          },
          {
            name: "📝 **Raison**",
            value: reason,
            inline: true
          },
          {
            name: "👮 **Modérateur**",
            value: interaction.user.toString(),
            inline: true
          },
          {
            name: "⏰ **Mute à**",
            value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
            inline: true
          },
          {
            name: "🔄 **Se termine**",
            value: `<t:${Math.floor((Date.now() + durationMs) / 1000)}:R>`,
            inline: true
          }
        )
        .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
        .setFooter({ 
          text: "Clarity Bot • Modération", 
          iconURL: client.user.displayAvatarURL({ dynamic: true }) 
        })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed]
      });
      
    } catch (error) {
      console.error("Erreur lors du mute :", error);
      await interaction.reply({
        content: "❌ Une erreur s'est produite lors du mute !",
        ephemeral: true
      });
    }
  },
};