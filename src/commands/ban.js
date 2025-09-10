const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { colors } = require("../config/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("🔨 Bannit un utilisateur du serveur")
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("👤 L'utilisateur à bannir")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("📝 Raison du bannissement")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction, client) {
    const user = interaction.options.getUser("utilisateur");
    const reason = interaction.options.getString("raison") || "Aucune raison donnée";
    
    try {
      // Vérifications
      if (user.id === interaction.user.id) {
        return interaction.reply({
          content: "❌ Vous ne pouvez pas vous bannir vous-même !",
          ephemeral: true
        });
      }
      
      if (user.id === interaction.guild.ownerId) {
        return interaction.reply({
          content: "❌ Vous ne pouvez pas bannir le propriétaire du serveur !",
          ephemeral: true
        });
      }
      
      // Vérifier si l'utilisateur est déjà banni
      const banInfo = await interaction.guild.bans.fetch(user.id).catch(() => null);
      if (banInfo) {
        return interaction.reply({
          content: `❌ **${user.username}** est déjà banni de ce serveur !`,
          ephemeral: true
        });
      }
      
      // Bannir l'utilisateur
      await interaction.guild.members.ban(user.id, { 
        reason: `${reason} (Ban par ${interaction.user.tag})`,
        deleteMessageDays: 7
      });
      
      // Envoyer un DM à l'utilisateur
      try {
        await user.send({
          content: `🔨 Vous avez été **banni** du serveur **${interaction.guild.name}** !\n**Raison :** ${reason}`
        });
      } catch (error) {
        // Ignorer si le DM échoue
      }
      
      const embed = new EmbedBuilder()
        .setColor(colors.error)
        .setTitle("🔨 Bannissement réussi !")
        .setDescription(`**${user.username}** a été banni avec succès !`)
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
            name: "⏰ **Banni à**",
            value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
            inline: true
          },
          {
            name: "🗑️ **Messages supprimés**",
            value: "7 derniers jours",
            inline: true
          },
          {
            name: "⚠️ **Note**",
            value: "L'utilisateur peut être débanni avec `/unban`",
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
      console.error("Erreur lors du ban :", error);
      await interaction.reply({
        content: "❌ Une erreur s'est produite lors du bannissement !",
        ephemeral: true
      });
    }
  },
};
