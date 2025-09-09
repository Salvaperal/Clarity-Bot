const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pp")
    .setDescription("🖼️ Affiche l'avatar d'un utilisateur")
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("👤 L'utilisateur dont vous voulez voir l'avatar")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("utilisateur") || interaction.user;
    
    const avatarURL = user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
    const avatarGIF = user.displayAvatarURL({ format: 'gif', dynamic: true, size: 1024 });
    const avatarWEBP = user.displayAvatarURL({ format: 'webp', dynamic: true, size: 1024 });
    const avatarJPG = user.displayAvatarURL({ format: 'jpg', dynamic: true, size: 1024 });

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`🖼️ Avatar de ${user.username}`)
      .setDescription(`Voici l'avatar de **${user.username}** !`)
      .setImage(avatarURL)
      .addFields(
        {
          name: "👤 **Utilisateur**",
          value: `${user} (${user.tag})`,
          inline: true
        },
        {
          name: "🆔 **ID**",
          value: `\`${user.id}\``,
          inline: true
        },
        {
          name: "🤖 **Bot**",
          value: user.bot ? "Oui" : "Non",
          inline: true
        },
        {
          name: "📅 **Compte créé**",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
          inline: true
        },
        {
          name: "🔗 **Liens**",
          value: `[PNG](${avatarURL}) • [GIF](${avatarGIF}) • [WEBP](${avatarWEBP}) • [JPG](${avatarJPG})`,
          inline: false
        }
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
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
