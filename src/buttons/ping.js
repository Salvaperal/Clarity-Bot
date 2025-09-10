const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { colors } = require("../config/colors");

module.exports = {
  data: {
    name: "ping",
    description: "🔄 Bouton pour actualiser la latence !",
  },
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

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle("🔄 Latence actualisée !")
      .setDescription("Voici les nouvelles informations de latence :")
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
        text: "Clarity Bot • Actualisé", 
        iconURL: client.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Actualiser")
        .setCustomId("ping")
        .setStyle(1)
        .setEmoji("🔄")
    );

    await interaction.update({
      embeds: [embed],
      components: [button]
    });
  },
};