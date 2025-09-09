const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fake-ban")
    .setDescription("🚫 Faux bannissement pour rigoler !")
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("👤 L'utilisateur à 'bannir'")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("📝 Raison du 'bannissement'")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const user = interaction.options.getUser("utilisateur");
    const reason = interaction.options.getString("raison") || "Aucune raison donnée";
    
    // Vérifier si c'est le propriétaire du bot
    if (user.id === client.user.id) {
      return interaction.reply({
        content: "❌ Je ne peux pas me bannir moi-même !",
        ephemeral: true
      });
    }
    
    // Vérifier si c'est l'utilisateur qui utilise la commande
    if (user.id === interaction.user.id) {
      return interaction.reply({
        content: "❌ Tu ne peux pas te bannir toi-même !",
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("🚫 Bannissement")
      .setDescription(`**${user}** a été banni du serveur !`)
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
        text: "Clarity Bot • Fake Ban", 
        iconURL: client.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  },
};