
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { colors } = require("../config/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("scam")
    .setDescription("🚨 Découvre ton niveau de scammeur !")
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("👤 L'utilisateur à analyser (optionnel)")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("utilisateur") || interaction.user;
    const block = "⬛";
    const scam = "🚨";
    
    const percentage = Math.floor(Math.random() * 101);
    const hearts = Math.floor(percentage / 10);
    
    const progressBar = `${scam.repeat(hearts)}${block.repeat(10 - hearts)}`;
    
    let status = "";
    let color = colors.error;
    
    if (percentage >= 80) {
      status = "🚨 Scammeur professionnel !";
      color = colors.error;
    } else if (percentage >= 60) {
      status = "🚨 Très suspect !";
      color = colors.error;
    } else if (percentage >= 40) {
      status = "🚨 Assez suspect !";
      color = colors.warning;
    } else if (percentage >= 20) {
      status = "🚨 Peu suspect !";
      color = colors.warning;
    } else {
      status = "✅ Honnête !";
      color = colors.success;
    }

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle("🚨 Test de Scam")
      .setDescription(`**${user}** est scammeur à **${percentage}%** !`)
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
          name: "🚨 **Scammeur**",
          value: percentage >= 50 ? "Oui ! 🚨" : "Non ! ✅",
          inline: true
        }
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setFooter({ 
        text: "Clarity Bot • Test de scam", 
        iconURL: client.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  },
};