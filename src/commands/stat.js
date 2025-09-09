const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stat")
    .setDescription("📊 Affiche les statistiques du bot"),

  async execute(interaction, client) {
    const totalGuilds = client.guilds.cache.size;
    const totalMembers = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
    const averageMembersPerGuild = Math.round(totalMembers / totalGuilds);
    
    // Calculer l'uptime
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    // Statistiques détaillées
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
      .setColor(0x5865f2)
      .setTitle("📊 Statistiques de Clarity Bot")
      .setDescription(`**Clarity Bot** est actuellement sur **${totalGuilds}** serveurs et surveille **${totalMembers}** membres !`)
      .addFields(
        {
          name: "🌍 **Serveurs**",
          value: `**${totalGuilds}** serveurs`,
          inline: true
        },
        {
          name: "👥 **Membres**",
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
          name: "⏱️ **Uptime**",
          value: `**${days}j ${hours}h ${minutes}m ${seconds}s**`,
          inline: true
        },
        {
          name: "💾 **Mémoire**",
          value: `**${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB**`,
          inline: true
        },
        {
          name: "🔄 **Version**",
          value: `**Node.js ${process.version}**`,
          inline: true
        },
        {
          name: "🎉 **Merci !**",
          value: "Merci à tous les utilisateurs !",
          inline: true
        }
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setFooter({ 
        text: "Clarity Bot • Statistiques", 
        iconURL: client.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=2146958591&scope=bot%20applications.commands`)
          .setLabel('Inviter le bot')
          .setEmoji("👑")
          .setStyle(5)
      );

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  },
};
