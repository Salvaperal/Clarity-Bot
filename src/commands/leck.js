const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leck")
    .setDescription("👁️ Cache un salon (le rend invisible)")
    .addChannelOption((option) =>
      option
        .setName("salon")
        .setDescription("📺 Le salon à cacher")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("📝 Raison du masquage")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction, client) {
    const channel = interaction.options.getChannel("salon");
    const reason = interaction.options.getString("raison") || "Aucune raison donnée";
    
    try {
      // Vérifier si le salon est valide
      if (!channel) {
        return interaction.reply({
          content: "❌ Salon introuvable !",
          ephemeral: true
        });
      }
      
      // Vérifier si le salon est déjà caché
      const everyoneRole = interaction.guild.roles.everyone;
      const currentPermissions = channel.permissionOverwrites.cache.get(everyoneRole.id);
      
      if (currentPermissions?.deny.has(PermissionFlagsBits.ViewChannel)) {
        return interaction.reply({
          content: "❌ Ce salon est déjà caché !",
          ephemeral: true
        });
      }
      
      // Cacher le salon
      await channel.permissionOverwrites.edit(everyoneRole.id, {
        ViewChannel: false
      }, { reason: `${reason} (Leck par ${interaction.user.tag})` });
      
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("👁️ Salon caché !")
        .setDescription(`Le salon **${channel.name}** a été caché avec succès !`)
        .addFields(
          {
            name: "📺 **Salon**",
            value: `${channel} (${channel.name})`,
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
            name: "⏰ **Caché à**",
            value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
            inline: true
          },
          {
            name: "👁️ **Visibilité**",
            value: "Caché pour @everyone",
            inline: true
          },
          {
            name: "⚠️ **Note**",
            value: "Le salon est maintenant invisible pour les membres",
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
      console.error("Erreur lors du masquage :", error);
      await interaction.reply({
        content: "❌ Une erreur s'est produite lors du masquage du salon !",
        ephemeral: true
      });
    }
  },
};