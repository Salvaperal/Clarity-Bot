const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("🗑️ Supprime un nombre spécifié de messages")
    .addIntegerOption((option) =>
      option
        .setName("nombre")
        .setDescription("🔢 Nombre de messages à supprimer (1-100)")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("👤 Supprimer seulement les messages de cet utilisateur")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction, client) {
    const nombre = interaction.options.getInteger("nombre");
    const utilisateur = interaction.options.getUser("utilisateur");

    // Vérifier les permissions
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: "❌ Vous n'avez pas la permission de gérer les messages !",
        ephemeral: true,
      });
    }

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: "❌ Je n'ai pas la permission de supprimer des messages !",
        ephemeral: true,
      });
    }

    try {
      // Récupérer les messages
      const messages = await interaction.channel.messages.fetch({ limit: nombre });
      let messagesToDelete = messages;

      // Filtrer par utilisateur si spécifié
      if (utilisateur) {
        messagesToDelete = messages.filter(msg => msg.author.id === utilisateur.id);
      }

      // Supprimer les messages
      if (messagesToDelete.size === 0) {
        return interaction.reply({
          content: "❌ Aucun message trouvé à supprimer !",
          ephemeral: true,
        });
      }

      await interaction.channel.bulkDelete(messagesToDelete, true);

      // Créer l'embed de confirmation
      const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("🗑️ Messages supprimés !")
        .setDescription(`**${messagesToDelete.size}** message(s) ont été supprimés avec succès !`)
        .addFields(
          {
            name: "📊 **Détails**",
            value: `• Messages supprimés : **${messagesToDelete.size}**\n• Canal : ${interaction.channel}\n• Modérateur : ${interaction.user}`,
            inline: false
          }
        )
        .setFooter({ 
          text: "Clarity Bot • Modération", 
          iconURL: client.user.displayAvatarURL({ dynamic: true }) 
        })
        .setTimestamp();

      // Répondre avec l'embed
      const reply = await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });

      // Supprimer la réponse après 5 secondes
      setTimeout(async () => {
        try {
          await reply.delete();
        } catch (error) {
          console.error("Erreur lors de la suppression de la réponse :", error);
        }
      }, 5000);

    } catch (error) {
      console.error("Erreur lors de la suppression des messages :", error);
      
      const errorEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("❌ Erreur !")
        .setDescription("Une erreur s'est produite lors de la suppression des messages.")
        .addFields(
          {
            name: "🔍 **Détails**",
            value: "• Les messages peuvent être trop anciens (14+ jours)\n• Permissions insuffisantes\n• Messages protégés",
            inline: false
          }
        )
        .setFooter({ 
          text: "Clarity Bot • Erreur", 
          iconURL: client.user.displayAvatarURL({ dynamic: true }) 
        })
        .setTimestamp();

      await interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true
      });
    }
  },
};
