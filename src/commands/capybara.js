const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("capybara")
    .setDescription("🦫 Découvre ton niveau de capybara !")
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("👤 L'utilisateur à analyser (optionnel)")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("utilisateur") || interaction.user;
    const block = "⬛";
    const capybara = "🦫";
    
    const percentage = Math.floor(Math.random() * 101);
    const hearts = Math.floor(percentage / 10);
    
    const progressBar = `${capybara.repeat(hearts)}${block.repeat(10 - hearts)}`;
    
    let status = "";
    let color = 0x00ff00;
    
    if (percentage >= 80) {
      status = "🦫 Capybara suprême !";
      color = 0x00ff00;
    } else if (percentage >= 60) {
      status = "🦫 Très capybara !";
      color = 0x90ee90;
    } else if (percentage >= 40) {
      status = "🦫 Assez capybara !";
      color = 0xffff00;
    } else if (percentage >= 20) {
      status = "🦫 Peu capybara !";
      color = 0xffa500;
    } else {
      status = "🦫 Pas du tout capybara !";
      color = 0xff0000;
    }

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle("🦫 Test de Capybara")
      .setDescription(`**${user}** est capybara à **${percentage}%** !`)
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
          name: "🦫 **Capybara**",
          value: percentage >= 50 ? "Oui ! 🦫" : "Non... 😢",
          inline: true
        }
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setFooter({ 
        text: "Clarity Bot • Test de capybara", 
        iconURL: client.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  },
};
