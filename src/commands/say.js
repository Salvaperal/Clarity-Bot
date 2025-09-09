const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("💬 Fait parler le bot dans le salon")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("💬 Le message que le bot doit envoyer")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction, client) {
    const message = interaction.options.getString("message");
    
    try {
      await interaction.reply({
        content: message,
        ephemeral: false
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      await interaction.reply({
        content: "❌ Une erreur s'est produite lors de l'envoi du message !",
        ephemeral: true
      });
    }
  },
};