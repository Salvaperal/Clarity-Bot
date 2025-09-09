const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pp-server")
    .setDescription("🏰 Affiche l'icône du serveur"),

  async execute(interaction, client) {
    const guild = interaction.guild;
    
    if (!guild.iconURL()) {
      return interaction.reply({
        content: "❌ Ce serveur n'a pas d'icône !",
        ephemeral: true
      });
    }
    
    const iconURL = guild.iconURL({ format: 'png', dynamic: true, size: 1024 });
    const iconGIF = guild.iconURL({ format: 'gif', dynamic: true, size: 1024 });
    const iconWEBP = guild.iconURL({ format: 'webp', dynamic: true, size: 1024 });
    const iconJPG = guild.iconURL({ format: 'jpg', dynamic: true, size: 1024 });

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`🏰 Icône de ${guild.name}`)
      .setDescription(`Voici l'icône du serveur **${guild.name}** !`)
      .setImage(iconURL)
      .addFields(
        {
          name: "🏰 **Serveur**",
          value: `${guild.name}`,
          inline: true
        },
        {
          name: "🆔 **ID**",
          value: `\`${guild.id}\``,
          inline: true
        },
        {
          name: "👥 **Membres**",
          value: `**${guild.memberCount}** membres`,
          inline: true
        },
        {
          name: "📅 **Créé le**",
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
          inline: true
        },
        {
          name: "👑 **Propriétaire**",
          value: `<@${guild.ownerId}>`,
          inline: true
        },
        {
          name: "🔗 **Liens**",
          value: `[PNG](${iconURL}) • [GIF](${iconGIF}) • [WEBP](${iconWEBP}) • [JPG](${iconJPG})`,
          inline: false
        }
      )
      .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
      .setFooter({ 
        text: `Demandé par ${interaction.user.username}`, 
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  },
};
