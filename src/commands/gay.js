const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { colors } = require("../config/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gay")
    .setDescription("🏳️‍🌈 Découvre ton niveau de gay !")
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("👤 L'utilisateur à analyser (optionnel)")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("utilisateur") || interaction.user;
    const block = "⬛";
    const rainbow = "🏳️‍🌈";
    
    const percentage = Math.floor(Math.random() * 101);
    const hearts = Math.floor(percentage / 10);
    
    const progressBar = `${rainbow.repeat(hearts)}${block.repeat(10 - hearts)}`;
    
    let status = "";
    let color = colors.primary;
    
    if (percentage >= 80) {
      status = "🏳️‍🌈 Très gay !";
      color = colors.success;
    } else if (percentage >= 60) {
      status = "🏳️‍🌈 Assez gay !";
      color = colors.accent;
    } else if (percentage >= 40) {
      status = "🏳️‍🌈 Un peu gay !";
      color = colors.primary;
    } else if (percentage >= 20) {
      status = "🏳️‍🌈 Pas très gay !";
      color = colors.warning;
    } else {
      status = "🏳️‍🌈 Pas gay du tout !";
      color = colors.error;
    }

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle("🏳️‍🌈 Test de Gay")
      .setDescription(`**${user}** est gay à **${percentage}%** !`)
      .addFields(
        {
          name: "📊 **Niveau**",
          value: `${progressBar} **${percentage}%**`,
          inline: false
        },
        {
          name: "🏆 **Statut**",
          value: status,
          inline: true
        },
        {
          name: "🏳️‍🌈 **Gay**",
          value: percentage >= 50 ? "Oui ! 🏳️‍🌈" : "Non... 😢",
          inline: true
        }
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setFooter({ 
        text: "Clarity Bot • Test de gay", 
        iconURL: client.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  },
};