const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite-bot")
    .setDescription("🤖 Génère des liens d'invitation pour un bot")
    .addUserOption((option) =>
      option
        .setName("bot")
        .setDescription("🤖 Le bot pour lequel générer les liens d'invitation")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const bot = interaction.options.getUser("bot");
    
    if (!bot.bot) {
      return interaction.reply({
        content: `❌ **${bot.username}** n'est pas un bot ! Vous ne pouvez pas générer de liens d'invitation pour un utilisateur normal.`,
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("🤖 Liens d'invitation du bot")
      .setDescription(`Voici les liens d'invitation pour **${bot.username}** !`)
      .addFields(
        {
          name: "🤖 **Bot**",
          value: `${bot} (${bot.tag})`,
          inline: true
        },
        {
          name: "🆔 **ID**",
          value: `\`${bot.id}\``,
          inline: true
        },
        {
          name: "📅 **Créé le**",
          value: `<t:${Math.floor(bot.createdTimestamp / 1000)}:F>`,
          inline: true
        },
        {
          name: "⚠️ **Note**",
          value: "Choisissez le niveau de permissions approprié pour votre serveur !",
          inline: false
        }
      )
      .setThumbnail(bot.displayAvatarURL({ dynamic: true, size: 256 }))
      .setFooter({ 
        text: `Demandé par ${interaction.user.username}`, 
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setURL(`https://discord.com/oauth2/authorize?client_id=${bot.id}&permissions=2146958591&scope=bot%20applications.commands`)
          .setLabel('Toutes permissions')
          .setEmoji("👑")
          .setStyle(5),
        new ButtonBuilder()
          .setURL(`https://discord.com/oauth2/authorize?client_id=${bot.id}&permissions=8&scope=bot%20applications.commands`)
          .setLabel('Administrateur')
          .setEmoji("🤖")
          .setStyle(5),
        new ButtonBuilder()
          .setURL(`https://discord.com/oauth2/authorize?client_id=${bot.id}&permissions=0&scope=bot%20applications.commands`)
          .setLabel('Aucune permission')
          .setEmoji("💀")
          .setStyle(5)
      );

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  },
};