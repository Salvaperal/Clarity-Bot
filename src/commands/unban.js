const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("🔓 Débannit un utilisateur du serveur")
    .addStringOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("👤 ID ou mention de l'utilisateur à débannir")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("📝 Raison du débannissement")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction, client) {
    const userInput = interaction.options.getString("utilisateur");
    const reason = interaction.options.getString("raison") || "Aucune raison donnée";
    
    try {
      let user;
      
      // Essayer de récupérer l'utilisateur par ID ou mention
      if (userInput.match(/^\d{17,19}$/)) {
        // C'est un ID
        user = await client.users.fetch(userInput).catch(() => null);
      } else if (userInput.match(/^<@!?(\d{17,19})>$/)) {
        // C'est une mention
        const userId = userInput.match(/^<@!?(\d{17,19})>$/)[1];
        user = await client.users.fetch(userId).catch(() => null);
      } else {
        return interaction.reply({
          content: "❌ Format invalide ! Utilisez l'ID ou mentionnez l'utilisateur.",
          ephemeral: true
        });
      }
      
      if (!user) {
        return interaction.reply({
          content: "❌ Utilisateur introuvable !",
          ephemeral: true
        });
      }
      
      // Vérifier si l'utilisateur est banni
      const banInfo = await interaction.guild.bans.fetch(user.id).catch(() => null);
      if (!banInfo) {
        return interaction.reply({
          content: `❌ **${user.username}** n'est pas banni de ce serveur !`,
          ephemeral: true
        });
      }
      
      // Débannir l'utilisateur
      await interaction.guild.members.unban(user.id, `${reason} (Unban par ${interaction.user.tag})`);
      
      const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("🔓 Unban réussi !")
        .setDescription(`**${user.username}** a été débanni avec succès !`)
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
            name: "⏰ **Débanni à**",
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
      console.error("Erreur lors du unban :", error);
      await interaction.reply({
        content: "❌ Une erreur s'est produite lors du débannissement !",
        ephemeral: true
      });
    }
  },
};
