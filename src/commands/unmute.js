const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { colors } = require("../config/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("🔊 Rend la parole à un utilisateur")
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("👤 L'utilisateur à unmute")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("📝 Raison de l'unmute")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const user = interaction.options.getUser("utilisateur");
    const reason = interaction.options.getString("raison") || "Aucune raison donnée";
    
    try {
      const member = await interaction.guild.members.fetch(user.id);
      
      // Vérifications
      if (user.id === interaction.user.id) {
        return interaction.reply({
          content: "❌ Vous ne pouvez pas vous unmute vous-même !",
          ephemeral: true
        });
      }
      
      if (user.id === interaction.guild.ownerId) {
        return interaction.reply({
          content: "❌ Vous ne pouvez pas unmute le propriétaire du serveur !",
          ephemeral: true
        });
      }
      
      if (!member.isCommunicationDisabled()) {
        return interaction.reply({
          content: "❌ Cet utilisateur n'est pas mute !",
          ephemeral: true
        });
      }
      
      // Vérifier la hiérarchie des rôles
      const executorMember = await interaction.guild.members.fetch(interaction.user.id);
      if (executorMember.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
        return interaction.reply({
          content: "❌ Vous ne pouvez pas unmute cette personne ! Votre rôle doit être plus élevé.",
          ephemeral: true
        });
      }
      
      // Unmute l'utilisateur
      await member.timeout(null, `${reason} (Unmute par ${interaction.user.tag})`);
      
      // Envoyer un DM à l'utilisateur
      try {
        await user.send({
          content: `🔊 Vous avez été **unmute** du serveur **${interaction.guild.name}** !\n**Raison :** ${reason}`
        });
      } catch (error) {
        // Ignorer si le DM échoue
      }
      
      const embed = new EmbedBuilder()
        .setColor(colors.success)
        .setTitle("🔊 Unmute réussi !")
        .setDescription(`**${user.username}** a été unmute avec succès !`)
        .addFields(
          {
            name: "👤 **Utilisateur**",
            value: `${user} (${user.tag})`,
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
      console.error("Erreur lors de l'unmute :", error);
      await interaction.reply({
        content: "❌ Une erreur s'est produite lors de l'unmute !",
        ephemeral: true
      });
    }
  },
};