const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poli")
    .setDescription("🗳️ Découvre pour qui tu votes !")
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("👤 L'utilisateur à analyser (optionnel)")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("utilisateur") || interaction.user;
    
    const candidates = [
      "Mélenchon",
      "Macron", 
      "Zemmour",
      "Le Pen",
      "Fabien Roussel",
      "Anne Hidalgo",
      "Valérie Pécresse",
      "Poutine",
      "Biden",
      "Trump",
      "Elexyr22",
      "FTNL"
    ];
    
    const result = candidates[Math.floor(Math.random() * candidates.length)];
    
    let color = 0x5865f2;
    let emoji = "🗳️";
    
    // Couleurs spécifiques pour certains candidats
    if (result === "Macron") color = 0x0000ff;
    else if (result === "Mélenchon") color = 0xff0000;
    else if (result === "Le Pen") color = 0x000080;
    else if (result === "Zemmour") color = 0x800080;
    else if (result === "Biden") color = 0x0000ff;
    else if (result === "Trump") color = 0xff0000;
    else if (result === "Poutine") color = 0xff0000;

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle("🗳️ Vote Politique")
      .setDescription(`**${user}** vote pour : **${result}** !`)
      .addFields(
        {
          name: "🗳️ **Candidat**",
          value: result,
          inline: true
        },
        {
          name: "📊 **Précision**",
          value: "Algorithme sûr (1% d'erreur)",
          inline: true
        }
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setFooter({ 
        text: "Clarity Bot • Vote politique", 
        iconURL: client.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  },
};