const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serveurinfo")
    .setDescription("🏰 Affiche les informations détaillées du serveur"),

  async execute(interaction, client) {
    const guild = interaction.guild;
    
    // Récupérer les membres
    await guild.members.fetch();
    const members = guild.members.cache;
    const humanMembers = members.filter(member => !member.user.bot);
    const botMembers = members.filter(member => member.user.bot);
    
    // Récupérer le propriétaire
    const owner = await guild.fetchOwner();
    
    // Compter les salons par type
    const textChannels = guild.channels.cache.filter(channel => channel.type === 0).size;
    const voiceChannels = guild.channels.cache.filter(channel => channel.type === 2).size;
    const categories = guild.channels.cache.filter(channel => channel.type === 4).size;
    const threads = guild.channels.cache.filter(channel => channel.type === 11).size;
    
    // Compter les emojis
    const staticEmojis = guild.emojis.cache.filter(emoji => !emoji.animated).size;
    const animatedEmojis = guild.emojis.cache.filter(emoji => emoji.animated).size;
    
    // Niveau de boost
    const boostLevel = guild.premiumTier;
    const boostCount = guild.premiumSubscriptionCount;
    
    // Vérifications de sécurité
    const verificationLevel = guild.verificationLevel;
    const mfaLevel = guild.mfaLevel;
    
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`🏰 Informations sur ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
      .setDescription(guild.description || "*Aucune description*")
      .addFields(
        {
          name: "🏰 **Informations générales**",
          value: `**Nom :** ${guild.name}\n**ID :** \`${guild.id}\`\n**Propriétaire :** ${owner}\n**Créé le :** <t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
          inline: false
        },
        {
          name: "👥 **Membres**",
          value: `**Total :** ${guild.memberCount}\n**Humains :** ${humanMembers.size}\n**Bots :** ${botMembers.size}`,
          inline: true
        },
        {
          name: "📊 **Salons**",
          value: `**Total :** ${guild.channels.cache.size}\n**Texte :** ${textChannels}\n**Vocal :** ${voiceChannels}\n**Catégories :** ${categories}\n**Threads :** ${threads}`,
          inline: true
        },
        {
          name: "🎭 **Rôles & Emojis**",
          value: `**Rôles :** ${guild.roles.cache.size}\n**Emojis :** ${guild.emojis.cache.size}\n**Statiques :** ${staticEmojis}\n**Animés :** ${animatedEmojis}`,
          inline: true
        },
        {
          name: "🚀 **Boost**",
          value: `**Niveau :** ${boostLevel}\n**Boosts :** ${boostCount}`,
          inline: true
        },
        {
          name: "🔒 **Sécurité**",
          value: `**Vérification :** ${verificationLevel}\n**2FA :** ${mfaLevel === 1 ? "Requis" : "Non requis"}`,
          inline: true
        },
        {
          name: "📋 **Salons spéciaux**",
          value: `**Règlement :** ${guild.rulesChannel || "*Aucun*"}\n**AFK :** ${guild.afkChannel || "*Aucun*"}\n**Vanity :** ${guild.vanityURLCode ? `https://discord.gg/${guild.vanityURLCode}` : "*Aucun*"}`,
          inline: false
        }
      )
      .setImage(guild.bannerURL({ format: 'png', dynamic: true, size: 4096 }))
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