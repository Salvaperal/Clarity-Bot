const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { colors } = require("../config/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("members")
    .setDescription("👥 Affiche le nombre de membres du serveur"),

  async execute(interaction, client) {
    const guild = interaction.guild;
    const memberCount = guild.memberCount;
    
    // Récupérer les membres en ligne
    await guild.members.fetch();
    const onlineMembers = guild.members.cache.filter(member => member.presence?.status !== 'offline').size;
    const botMembers = guild.members.cache.filter(member => member.user.bot).size;
    const humanMembers = memberCount - botMembers;

    const embed = new EmbedBuilder()
      .setColor(colors.success)
      .setTitle("👥 Statistiques des Membres")
      .setDescription(`**${guild.name}** compte actuellement **${memberCount}** membres !`)
      .addFields(
        {
          name: "👥 **Total**",
          value: `**${memberCount}** membres`,
          inline: true
        },
        {
          name: "🟢 **En ligne**",
          value: `**${onlineMembers}** membres`,
          inline: true
        },
        {
          name: "🤖 **Bots**",
          value: `**${botMembers}** bots`,
          inline: true
        },
        {
          name: "👤 **Humains**",
          value: `**${humanMembers}** humains`,
          inline: true
        },
        {
          name: "📊 **Pourcentage**",
          value: `**${Math.round((onlineMembers / memberCount) * 100)}%** en ligne`,
          inline: true
        },
        {
          name: "🎉 **Merci !**",
          value: "Merci à tous les membres !",
          inline: true
        }
      )
      .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
      .setFooter({ 
        text: "Clarity Bot • Statistiques", 
        iconURL: client.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  },
};