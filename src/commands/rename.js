const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rename")
    .setDescription("📝 Renomme le salon actuel")
    .addStringOption((option) =>
      option
        .setName("nom")
        .setDescription("📝 Nouveau nom du salon")
        .setRequired(true)
        .setMaxLength(100)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction, client) {
    const newName = interaction.options.getString("nom");
    const channel = interaction.channel;
    
    try {
      // Vérifier si le nom est valide
      if (!newName || newName.trim().length === 0) {
        return interaction.reply({
          content: "❌ Le nom du salon ne peut pas être vide !",
          ephemeral: true
        });
      }
      
      if (newName.length > 100) {
        return interaction.reply({
          content: "❌ Le nom du salon ne peut pas dépasser 100 caractères !",
          ephemeral: true
        });
      }
      
      // Renommer le salon
      await channel.setName(newName, `Renommage par ${interaction.user.tag}`);
      
      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle("📝 Salon renommé !")
        .setDescription(`Le salon a été renommé avec succès !`)
        .addFields(
          {
            name: "📝 **Nouveau nom**",
            value: `**${newName}**`,
            inline: true
          },
          {
            name: "👮 **Modérateur**",
            value: interaction.user.toString(),
            inline: true
          },
          {
            name: "⏰ **Renommé à**",
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
      
    } catch (error) {
      console.error("Erreur lors du renommage :", error);
      await interaction.reply({
        content: "❌ Une erreur s'est produite lors du renommage du salon !",
        ephemeral: true
      });
    }
  },
};