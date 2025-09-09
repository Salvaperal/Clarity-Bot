const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("🔓 Déverrouille le salon actuel")
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("📝 Raison du déverrouillage")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction, client) {
    const reason = interaction.options.getString("raison") || "Aucune raison donnée";
    const channel = interaction.channel;
    
    try {
      // Vérifier si le salon est déjà déverrouillé
      const everyoneRole = interaction.guild.roles.everyone;
      const currentPermissions = channel.permissionOverwrites.cache.get(everyoneRole.id);
      
      if (currentPermissions?.allow.has(PermissionFlagsBits.SendMessages)) {
        return interaction.reply({
          content: "❌ Ce salon est déjà déverrouillé !",
          ephemeral: true
        });
      }
      
      // Déverrouiller le salon
      await channel.permissionOverwrites.edit(everyoneRole.id, {
        SendMessages: true
      }, { reason: `${reason} (Unlock par ${interaction.user.tag})` });
      
      const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("🔓 Salon déverrouillé !")
        .setDescription(`Le salon **${channel.name}** a été déverrouillé avec succès !`)
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
            name: "⏰ **Déverrouillé à**",
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
      console.error("Erreur lors du déverrouillage :", error);
      await interaction.reply({
        content: "❌ Une erreur s'est produite lors du déverrouillage du salon !",
        ephemeral: true
      });
    }
  },
};