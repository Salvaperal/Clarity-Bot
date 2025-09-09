
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("love")
    .setDescription("💕 Calcule le niveau d'amour entre deux personnes !")
    .addUserOption((option) =>
      option
        .setName("utilisateur1")
        .setDescription("👤 Premier utilisateur")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("utilisateur2")
        .setDescription("👤 Deuxième utilisateur")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const user1 = interaction.options.getUser("utilisateur1");
    const user2 = interaction.options.getUser("utilisateur2");
    
    if (user1.id === user2.id) {
      return interaction.reply({
        content: "❌ Tu ne peux pas calculer l'amour avec toi-même !",
        ephemeral: true
      });
    }
    
    const block = "⬛";
    const heart = "💕";
    
    const percentage = Math.floor(Math.random() * 101);
    const hearts = Math.floor(percentage / 10);
    
    const progressBar = `${heart.repeat(hearts)}${block.repeat(10 - hearts)}`;
    
    let status = "";
    let color = 0xf47fff;
    
    if (percentage >= 90) {
      status = "💕 Amour parfait !";
      color = 0xff69b4;
    } else if (percentage >= 70) {
      status = "💕 Très amoureux !";
      color = 0xff1493;
    } else if (percentage >= 50) {
      status = "💕 Assez amoureux !";
      color = 0xf47fff;
    } else if (percentage >= 30) {
      status = "💕 Un peu amoureux !";
      color = 0xffc0cb;
    } else {
      status = "💔 Pas d'amour !";
      color = 0xff0000;
    }

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle("💕 Test d'Amour")
      .setDescription(`**${user1}** et **${user2}** sont amoureux à **${percentage}%** !`)
      .addFields(
        {
          name: "📊 **Niveau d'amour**",
          value: `${progressBar} **${percentage}%**`,
          inline: false
        },
        {
          name: "🏆 **Statut**",
          value: status,
          inline: true
        },
        {
          name: "💕 **Relation**",
          value: percentage >= 50 ? "Amoureux ! 💕" : "Pas d'amour... 💔",
          inline: true
        }
      )
      .setThumbnail(user1.displayAvatarURL({ dynamic: true, size: 256 }))
      .setFooter({ 
        text: "Clarity Bot • Test d'amour", 
        iconURL: client.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  },
};