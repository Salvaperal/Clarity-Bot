const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { colors } = require("../config/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pile-face")
    .setDescription("🪙 Lance une pièce pour pile ou face !"),

  async execute(interaction, client) {
    const result = Math.random() < 0.5 ? "Pile" : "Face";
    const emoji = result === "Pile" ? "🪙" : "🪙";
    
    let color = colors.primary;
    let description = "";
    
    if (result === "Pile") {
      color = colors.warning;
      description = "**Pile !** La pièce est tombée sur le côté pile !";
    } else {
      color = colors.accent;
      description = "**Face !** La pièce est tombée sur le côté face !";
    }

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle("🪙 Pile ou Face")
      .setDescription(description)
      .addFields(
        {
          name: "🎯 **Résultat**",
          value: `||**${result}**||`,
          inline: true
        },
        {
          name: "🪙 **Pièce**",
          value: emoji,
          inline: true
        },
        {
          name: "🎲 **Chance**",
          value: "50/50",
          inline: true
        }
      )
      .setThumbnail("https://cdn.discordapp.com/emojis/1234567890123456789.png")
      .setFooter({ 
        text: "Clarity Bot • Pile ou Face", 
        iconURL: client.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  },
};
