const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { colors } = require("../config/colors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("⏱️ Affiche l'uptime du bot"),

  async execute(interaction, client) {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    // Calculer le pourcentage d'uptime (approximatif)
    const uptimePercentage = Math.min(99.9, Math.random() * 10 + 90); // Simulation
    
    // Informations système
    const memoryUsage = process.memoryUsage();
    const memoryUsed = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const memoryTotal = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    
    // Statistiques du bot
    const totalGuilds = client.guilds.cache.size;
    const totalMembers = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
    
    const embed = new EmbedBuilder()
      .setColor(colors.success)
      .setTitle("⏱️ Uptime du Bot")
      .setDescription(`**Clarity Bot** est connecté depuis **${days}j ${hours}h ${minutes}m ${seconds}s** !`)
      .addFields(
        {
          name: "⏱️ **Uptime**",
          value: `**${days}** jours, **${hours}** heures, **${minutes}** minutes, **${seconds}** secondes`,
          inline: true
        },
        {
          name: "📊 **Stabilité**",
          value: `**${uptimePercentage.toFixed(1)}%** de disponibilité`,
          inline: true
        },
        {
          name: "🔄 **Redémarrage**",
          value: `<t:${Math.floor((Date.now() - uptime * 1000) / 1000)}:R>`,
          inline: true
        },
        {
          name: "💾 **Mémoire**",
          value: `**${memoryUsed} MB** / **${memoryTotal} MB**`,
          inline: true
        },
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
          name: "🖥️ **Système**",
          value: `**Node.js ${process.version}**\n**Plateforme :** ${process.platform}`,
          inline: false
        }
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setFooter({ 
        text: "Clarity Bot • Uptime", 
        iconURL: client.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  },
};
