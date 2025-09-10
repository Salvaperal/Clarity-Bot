const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const { colors } = require("../config/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Affiche la latence du client"),

  async execute(interaction, client) {
    const ping = Math.round(client.ws.ping);
    let status = "\`\`\`🟢 Excellent\`\`\`";
    let color = colors.success;
    
    if (ping > 200) {
      status = "\`\`\`🔴 Mauvais\`\`\`";
      color = colors.error;
    } else if (ping > 100) {
      status = "\`\`\`🟡 Correct\`\`\`";
      color = colors.warning;
    }

    const pingembed = new EmbedBuilder()
      .setColor(color)
      .setTitle("🏓 Pong !")
      .setDescription("Voici les informations de latence du bot :")
      .addFields(
        {
          name: "📡 **Latence API**",
          value: `\`\`\`${ping}ms\`\`\``,
          inline: true,
        },
        {
          name: "📊 **Statut**",
          value: status,
          inline: true,
        },
        {
          name: "⏱️ **Temps de réponse**",
          value: `\`\`\`${Math.abs(Date.now() - interaction.createdTimestamp)}ms\`\`\``,
          inline: true,
        }
      )
      .setFooter({ 
        text: "Clarity Bot • Test de latence", 
        iconURL: client.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Statut Discord")
        .setStyle(5)
        .setEmoji("🌐")
        .setURL("https://discordstatus.com/"),
        new ButtonBuilder()
        .setLabel("Actualiser")
        .setCustomId("ping")
        .setStyle(1)
        .setEmoji("🔄")
    );

    await interaction.reply({
      embeds: [pingembed],
      components: [button],
    });
  },
};
