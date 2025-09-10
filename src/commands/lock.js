const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { colors } = require("../config/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("🔒 Verrouille le salon actuel")
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("📝 Raison du verrouillage")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction, client) {
    const reason = interaction.options.getString("raison") || "Aucune raison donnée";
    const channel = interaction.channel;
    
    try {
      // Vérifier si le salon est déjà verrouillé
      const everyoneRole = interaction.guild.roles.everyone;
      const currentPermissions = channel.permissionOverwrites.cache.get(everyoneRole.id);
      
      if (currentPermissions?.deny.has(PermissionFlagsBits.SendMessages)) {
        return interaction.reply({
          content: "❌ Ce salon est déjà verrouillé !",
          ephemeral: true
        });
      }
      
      // Verrouiller le salon
      await channel.permissionOverwrites.edit(everyoneRole.id, {
        SendMessages: false
      }, { reason: `${reason} (Lock par ${interaction.user.tag})` });
      
      const embed = new EmbedBuilder()
        .setColor(colors.error)
        .setTitle("🔒 Salon verrouillé !")
        .setDescription(`Le salon **${channel.name}** a été verrouillé avec succès !`)
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
            name: "⏰ **Verrouillé à**",
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
      console.error("Erreur lors du verrouillage :", error);
      await interaction.reply({
        content: "❌ Une erreur s'est produite lors du verrouillage du salon !",
        ephemeral: true
      });
    }
  },
};