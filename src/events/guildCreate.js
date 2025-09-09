const { Events, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = async (client, guild) => {
  try {
    // Chercher le propriétaire du serveur
    const owner = await guild.fetchOwner();

    // Créer l'embed à envoyer
    const embed = new EmbedBuilder()
      .setTitle("🎉 Merci de m'avoir ajouté !")
      .setDescription(
        "✨ **Salut !** Je suis **Clarity**, votre nouveau bot Discord !\n\n" +
        "🚀 **Ce que je peux faire pour vous :**\n" +
        "• Gérer votre serveur avec style\n" +
        "• Répondre à vos commandes\n" +
        "• Vous aider dans vos tâches quotidiennes\n\n" +
        "💡 **Besoin d'aide ?** N'hésitez pas à me contacter !\n" +
        "🎯 Tapez `/` pour voir toutes mes commandes disponibles"
      )
      .setColor(0x00ff88)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setFooter({ 
        text: "Clarity Bot • Fait avec ❤️", 
        iconURL: client.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp()
      .addFields(
        {
          name: "🔧 Commandes disponibles",
          value: "Tapez `/` pour voir la liste complète",
          inline: true
        },
        {
          name: "📞 Support",
          value: "Contactez le développeur si besoin",
          inline: true
        },
        {
          name: "⭐ Fonctionnalités",
          value: "Modération • Utilitaires • Fun",
          inline: true
        }
      );

    // Trouver un salon texte où le bot peut envoyer un message
    const channel = guild.channels.cache
      .filter(
        (c) =>
          c.type === 0 && // GuildText
          c
            .permissionsFor(guild.members.me)
            .has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel])
      )
      .first();

    // Envoyer le message dans le salon trouvé, en pingant le propriétaire
    if (channel && owner) {
      await channel.send({
        content: `<@${owner.id}>`,
        embeds: [embed],
      });
    }

    // Envoyer le même embed en message privé au propriétaire
    if (owner) {
      await owner.send({ embeds: [embed] });
    }
  } catch (err) {
    console.error("Erreur lors de l'envoi du message de bienvenue :", err);
  }
};
