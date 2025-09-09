const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("👢 Expulse un utilisateur du serveur")
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("👤 L'utilisateur à expulser")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("📝 Raison de l'expulsion")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction, client) {
    const user = interaction.options.getUser("utilisateur");
    const reason = interaction.options.getString("raison") || "Aucune raison donnée";
    
    try {
      const member = await interaction.guild.members.fetch(user.id);
      
      // Vérifications
      if (user.id === interaction.user.id) {
        return interaction.reply({
          content: "❌ Vous ne pouvez pas vous expulser vous-même !",
          ephemeral: true
        });
      }
      
      if (user.id === interaction.guild.ownerId) {
        return interaction.reply({
          content: "❌ Vous ne pouvez pas expulser le propriétaire du serveur !",
          ephemeral: true
        });
      }
      
      // Vérifier la hiérarchie des rôles
      const executorMember = await interaction.guild.members.fetch(interaction.user.id);
      if (executorMember.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
        return interaction.reply({
          content: "❌ Vous ne pouvez pas expulser cette personne ! Votre rôle doit être plus élevé.",
          ephemeral: true
        });
      }
      
      // Envoyer un DM à l'utilisateur
      try {
        await user.send({
          content: `👢 Vous avez été **expulsé** du serveur **${interaction.guild.name}** !\n**Raison :** ${reason}`
        });
      } catch (error) {
        // Ignorer si le DM échoue
      }
      
      // Expulser l'utilisateur
      await member.kick(`${reason} (Kick par ${interaction.user.tag})`);
      
      const embed = new EmbedBuilder()
        .setColor(0xffa500)
        .setTitle("👢 Expulsion réussie !")
        .setDescription(`**${user.username}** a été expulsé avec succès !`)
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
          },
          {
            name: "⏰ **Expulsé à**",
            value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
            inline: true
          },
          {
            name: "🔄 **Peut revenir**",
            value: "Oui, avec un lien d'invitation",
            inline: true
          },
          {
            name: "⚠️ **Note**",
            value: "L'utilisateur peut être réinvité",
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
      console.error("Erreur lors du kick :", error);
      await interaction.reply({
        content: "❌ Une erreur s'est produite lors de l'expulsion !",
        ephemeral: true
      });
    }
  },
};