const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { colors } = require("../config/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("prune")
    .setDescription("🧹 Supprime les messages d'un utilisateur spécifique")
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("👤 L'utilisateur dont supprimer les messages")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("nombre")
        .setDescription("🔢 Nombre de messages à supprimer (1-100)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction, client) {
    const user = interaction.options.getUser("utilisateur");
    const number = interaction.options.getInteger("nombre");
    
    try {
      // Vérifier si l'utilisateur est valide
      if (!user) {
        return interaction.reply({
          content: "❌ Utilisateur introuvable !",
          ephemeral: true
        });
      }
      
      // Récupérer les messages de l'utilisateur
      const messages = await interaction.channel.messages.fetch({ limit: 100 });
      const userMessages = messages.filter(m => m.author.id === user.id);
      
      if (userMessages.size === 0) {
        return interaction.reply({
          content: `❌ **${user.username}** n'a envoyé aucun message dans ce salon !`,
          ephemeral: true
        });
      }
      
      // Limiter le nombre de messages à supprimer
      const messagesToDelete = Array.from(userMessages.values()).slice(0, number);
      
      if (messagesToDelete.length === 0) {
        return interaction.reply({
          content: `❌ **${user.username}** n'a envoyé aucun message dans ce salon !`,
          ephemeral: true
        });
      }
      
      // Supprimer les messages
      let deletedCount = 0;
      try {
        // Essayer bulkDelete d'abord
        const deleted = await interaction.channel.bulkDelete(messagesToDelete);
        deletedCount = deleted.size;
      } catch (error) {
        // Si bulkDelete échoue, essayer de supprimer les messages un par un
        for (const message of messagesToDelete) {
          try {
            // Vérifier que le message n'est pas trop ancien (14 jours)
            if (message.createdAt > Date.now() - 1209600000) {
              await message.delete();
              deletedCount++;
            }
          } catch (err) {
            // Ignorer les erreurs de suppression individuelle
            console.log(`Impossible de supprimer le message ${message.id}:`, err.message);
          }
        }
      }
      
      const embed = new EmbedBuilder()
        .setColor(colors.success)
        .setTitle("🧹 Messages supprimés !")
        .setDescription(`**${deletedCount}** message(s) de **${user.username}** ont été supprimés !`)
        .addFields(
          {
            name: "👤 **Utilisateur**",
            value: `${user} (${user.tag})`,
            inline: true
          },
          {
            name: "🔢 **Messages supprimés**",
            value: `**${deletedCount}** sur **${number}** demandés`,
            inline: true
          },
          {
            name: "👮 **Modérateur**",
            value: interaction.user.toString(),
            inline: true
          },
          {
            name: "⏰ **Supprimés à**",
            value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
            inline: true
          }
        )
        .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
        .setFooter({ 
          text: "Clarity Bot • Modération", 
          iconURL: client.user.displayAvatarURL({ dynamic: true }) 
        })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed]
      });
      
    } catch (error) {
      console.error("Erreur lors de la suppression des messages :", error);
      await interaction.reply({
        content: "❌ Une erreur s'est produite lors de la suppression des messages !",
        ephemeral: true
      });
    }
  },
};