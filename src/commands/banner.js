const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("banner")
    .setDescription("🖼️ Affiche la bannière d'un utilisateur")
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("👤 L'utilisateur dont vous voulez voir la bannière")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("utilisateur") || interaction.user;
    
    try {
      // Récupérer l'utilisateur avec force pour obtenir la bannière
      const fullUser = await client.users.fetch(user.id, { force: true });
      const bannerURL = fullUser.bannerURL({ dynamic: true, size: 4096 });
      
      if (!bannerURL) {
        return interaction.reply({
          content: `❌ **${user.username}** n'a pas de bannière personnalisée !`,
          ephemeral: true
        });
      }

      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle(`🖼️ Bannière de ${user.username}`)
        .setDescription(`Voici la bannière de **${user.username}** !`)
        .setImage(bannerURL)
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
            name: "📅 **Compte créé**",
            value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
            inline: true
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

    } catch (error) {
      console.error("Erreur lors de la récupération de la bannière :", error);
      await interaction.reply({
        content: "❌ Une erreur s'est produite lors de la récupération de la bannière !",
        ephemeral: true
      });
    }
  },
};
