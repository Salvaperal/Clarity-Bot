const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { colors } = require("../config/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("members-all")
    .setDescription("🌍 Affiche le nombre total de membres sur tous les serveurs"),

  async execute(interaction, client) {
    const totalGuilds = client.guilds.cache.size;
    const totalMembers = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
    
    // Calculer les moyennes
    const averageMembersPerGuild = Math.round(totalMembers / totalGuilds);
    
    // Récupérer les statistiques détaillées
    let botCount = 0;
    let humanCount = 0;
    
    for (const guild of client.guilds.cache.values()) {
      try {
        await guild.members.fetch();
        const guildBots = guild.members.cache.filter(member => member.user.bot).size;
        const guildHumans = guild.memberCount - guildBots;
        botCount += guildBots;
        humanCount += guildHumans;
      } catch (error) {
        // Ignorer les erreurs de permissions
      }
    }

    const embed = new EmbedBuilder()
      .setColor(colors.primary)
      .setTitle("🌍 Statistiques Globales")
      .setDescription(`**Clarity Bot** surveille actuellement **${totalMembers}** membres sur **${totalGuilds}** serveurs !`)
      .addFields(
        {
          name: "🌍 **Serveurs**",
          value: `**${totalGuilds}** serveurs`,
          inline: true
        },
        {
          name: "👥 **Total Membres**",
          value: `**${totalMembers}** membres`,
          inline: true
        },
        {
          name: "📊 **Moyenne**",
          value: `**${averageMembersPerGuild}** membres/serveur`,
          inline: true
        },
        {
          name: "👤 **Humains**",
          value: `**${humanCount}** humains`,
          inline: true
        },
        {
          name: "🤖 **Bots**",
          value: `**${botCount}** bots`,
          inline: true
        },
        {
          name: "📈 **Croissance**",
          value: "Bot en expansion !",
          inline: true
        }
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setFooter({ 
        text: "Clarity Bot • Statistiques globales", 
        iconURL: client.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  },
};