const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { colors } = require("../config/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timer")
    .setDescription("⏰ Crée un minuteur personnalisé")
    .addStringOption((option) =>
      option
        .setName("duree")
        .setDescription("⏱️ Durée du minuteur (ex: 30s, 5m, 1h)")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction, client) {
    const duration = interaction.options.getString("duree");
    
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
        content: "❌ Format invalide ! Utilisez : `30s`, `5m`, `1h`, `2d`",
        ephemeral: true
      });
    }
    
    if (durationMs > 2147483647) {
      return interaction.reply({
        content: "❌ Durée trop longue ! Maximum : 24 jours",
        ephemeral: true
      });
    }
    
    if (durationMs < 1000) {
      return interaction.reply({
        content: "❌ Durée trop courte ! Minimum : 1 seconde",
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
    
    const embed = new EmbedBuilder()
      .setColor(colors.success)
      .setTitle("⏰ Minuteur démarré !")
      .setDescription(`Minuteur configuré pour **${readableDuration.trim()}**`)
      .addFields(
        {
          name: "⏱️ **Durée**",
          value: readableDuration.trim(),
          inline: true
        },
        {
          name: "👤 **Utilisateur**",
          value: interaction.user.toString(),
          inline: true
        },
        {
          name: "⏰ **Expire dans**",
          value: `<t:${Math.floor((Date.now() + durationMs) / 1000)}:R>`,
          inline: true
        }
      )
      .setFooter({ 
        text: "Clarity Bot • Minuteur", 
        iconURL: client.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
    
    // Programmer la notification
    setTimeout(async () => {
      const endEmbed = new EmbedBuilder()
        .setColor(colors.error)
        .setTitle("⏰ Minuteur terminé !")
        .setDescription(`**${interaction.user}**, votre minuteur de **${readableDuration.trim()}** est terminé !`)
        .addFields(
          {
            name: "⏱️ **Durée**",
            value: readableDuration.trim(),
            inline: true
          },
          {
            name: "👤 **Utilisateur**",
            value: interaction.user.toString(),
            inline: true
          },
          {
            name: "⏰ **Terminé à**",
            value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
            inline: true
          }
        )
        .setFooter({ 
          text: "Clarity Bot • Minuteur terminé", 
          iconURL: client.user.displayAvatarURL({ dynamic: true }) 
        })
        .setTimestamp();

      try {
        await interaction.followUp({
          content: `${interaction.user}`,
          embeds: [endEmbed]
        });
      } catch (error) {
        console.error("Erreur lors de l'envoi de la notification de minuteur :", error);
      }
    }, durationMs);
  },
};