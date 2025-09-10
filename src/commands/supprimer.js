const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { colors } = require("../config/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("supprimer")
    .setDescription("🗑️ Supprime le salon actuel")
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("📝 Raison de la suppression")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const reason = interaction.options.getString("raison") || "Aucune raison donnée";
    const channel = interaction.channel;
    
    try {
      // Envoyer un message de confirmation avant la suppression
      const embed = new EmbedBuilder()
        .setColor(colors.error)
        .setTitle("🗑️ Salon supprimé !")
        .setDescription(`Le salon **${channel.name}** a été supprimé !`)
        .addFields(
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
            name: "⏰ **Supprimé à**",
            value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
            inline: true
          }
        )
        .setFooter({ 
          text: "Clarity Bot • Modération", 
          iconURL: client.user.displayAvatarURL({ dynamic: true }) 
        })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed]
      });
      
      // Attendre un peu avant de supprimer
      setTimeout(async () => {
        try {
          await channel.delete(`Suppression par ${interaction.user.tag} - ${reason}`);
        } catch (error) {
          console.error("Erreur lors de la suppression du salon :", error);
        }
      }, 2000);
      
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      await interaction.reply({
        content: "❌ Une erreur s'est produite lors de la suppression du salon !",
        ephemeral: true
      });
    }
  },
};
