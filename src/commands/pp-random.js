const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pp-random")
    .setDescription("🎲 Affiche l'avatar d'un membre aléatoire du serveur"),

  async execute(interaction, client) {
    const guild = interaction.guild;
    
    // Récupérer tous les membres
    await guild.members.fetch();
    const members = guild.members.cache.filter(member => !member.user.bot);
    
    if (members.size === 0) {
      return interaction.reply({
        content: "❌ Aucun membre trouvé sur ce serveur !",
        ephemeral: true
      });
    }
    
    const randomMember = members.random();
    const user = randomMember.user;
    
    const avatarURL = user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
    const avatarGIF = user.displayAvatarURL({ format: 'gif', dynamic: true, size: 1024 });
    const avatarWEBP = user.displayAvatarURL({ format: 'webp', dynamic: true, size: 1024 });
    const avatarJPG = user.displayAvatarURL({ format: 'jpg', dynamic: true, size: 1024 });

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`🎲 Avatar Aléatoire`)
      .setDescription(`Voici l'avatar de **${user.username}** (membre aléatoire) !`)
      .setImage(avatarURL)
      .addFields(
        {
          name: "👤 **Utilisateur**",
          value: `${user} (${user.tag})`,
          inline: true
        },
        {
          name: "🆔 **ID**",
          value: `\`${user.id}\``,
          inline: true
        },
        {
          name: "📅 **A rejoint**",
          value: `<t:${Math.floor(randomMember.joinedTimestamp / 1000)}:R>`,
          inline: true
        },
        {
          name: "🔗 **Liens**",
          value: `[PNG](${avatarURL}) • [GIF](${avatarGIF}) • [WEBP](${avatarWEBP}) • [JPG](${avatarJPG})`,
          inline: false
        }
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setFooter({ 
        text: `Demandé par ${interaction.user.username}`, 
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  },
};
