
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { colors } = require("../config/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("🔮 Pose une question à la boule magique !")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("❓ Votre question pour la boule magique")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const question = interaction.options.getString("question");
    
    const replies = [
      "🟢 Oui, absolument !",
      "🔴 Non, certainement pas !",
      "🟡 Peut-être...",
      "🟢 Probablement que oui !",
      "🔴 Probablement que non !",
      "🟡 Je ne peux pas prédire l'avenir !",
      "🟢 Les signes sont favorables !",
      "🔴 Les signes ne sont pas favorables !",
      "🟡 Demande-moi plus tard !",
      "🟢 Concentre-toi et demande à nouveau !",
      "🔴 Ma réponse est non !",
      "🟡 Très douteux !",
      "🟢 C'est certain !",
      "🔴 C'est impossible !",
      "🟡 Les perspectives ne sont pas bonnes !",
      "🟢 Oui, définitivement !",
      "🔴 Non, pas du tout !",
      "🟡 Réponse brumeuse, réessaie !",
      "🟢 Très probable !",
      "🔴 Très improbable !"
    ];
    
    const res = Math.floor(Math.random() * replies.length);
    const answer = replies[res];
    
    const embed = new EmbedBuilder()
      .setColor(colors.primary)
      .setTitle("🔮 Boule Magique")
      .setDescription(`**Question :** ${question}`)
      .addFields(
        {
          name: "🎯 **Réponse**",
          value: `||${answer}||`,
          inline: false
        }
      )
      .setThumbnail("https://cdn.discordapp.com/emojis/1234567890123456789.png")
      .setFooter({ 
        text: "Clarity Bot • Boule magique", 
        iconURL: client.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  },
};