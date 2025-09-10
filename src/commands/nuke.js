const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { colors } = require("../config/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nuke")
    .setDescription("💥 Clone le salon actuel et supprime l'ancien")
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("📝 Raison du nuke")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const reason = interaction.options.getString("raison") || "Aucune raison donnée";
    const channel = interaction.channel;
    
    try {
      // Envoyer un message de confirmation
      const embed = new EmbedBuilder()
        .setColor(colors.error)
        .setTitle("💥 Nuke en cours...")
        .setDescription(`Le salon **${channel.name}** va être nuké !`)
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
            name: "⏰ **Nuké à**",
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
      
      // Attendre un peu avant de nuke
      setTimeout(async () => {
        try {
          // Cloner le salon
          const clonedChannel = await channel.clone({
            reason: `Nuke par ${interaction.user.tag} - ${reason}`
          });
          
          // Déplacer le salon cloné à la position de l'ancien
          await clonedChannel.setPosition(channel.position);
          
          // Envoyer un message dans le nouveau salon
          const nukeEmbed = new EmbedBuilder()
            .setColor(colors.error)
            .setTitle("💥 Salon Nuké !")
            .setDescription(`**Le salon a été nuké !**\n\n**Ancien salon :** ${channel.name}\n**Nouveau salon :** ${clonedChannel.name}`)
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
                name: "⏰ **Nuké à**",
                value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
                inline: true
              }
            )
            .setFooter({ 
              text: "Clarity Bot • Modération", 
              iconURL: client.user.displayAvatarURL({ dynamic: true }) 
            })
            .setTimestamp();
          
          await clonedChannel.send({
            content: `💥 **Le salon a été nuké !**`,
            embeds: [nukeEmbed]
          });
          
          // Supprimer l'ancien salon
          await channel.delete(`Nuke par ${interaction.user.tag} - ${reason}`);
          
        } catch (error) {
          console.error("Erreur lors du nuke :", error);
        }
      }, 2000);
      
    } catch (error) {
      console.error("Erreur lors du nuke :", error);
      await interaction.reply({
        content: "❌ Une erreur s'est produite lors du nuke du salon !",
        ephemeral: true
      });
    }
  },
};