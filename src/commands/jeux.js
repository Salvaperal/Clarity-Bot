const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jeux")
    .setDescription("🎮 Choisissez un jeu amusant à jouer !")
    .addStringOption((option) =>
      option
        .setName("jeu")
        .setDescription("🎯 Sélectionnez le type de jeu que vous voulez jouer")
        .setAutocomplete(true)
        .setRequired(true)
    ),

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const choices = [
      "🤔 Préfères-tu",
      "🙈 Je n'ai jamais",
      "🧠 Quiz",
      "💀 Action ou Vérité",
      "🤷 Que ferais-tu",
    ];
    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },

  async execute(interaction, client) {
    const { EmbedBuilder } = require("discord.js");
    const jeuChoisi = interaction.options.getString("jeu");
    
    // Comment travailler avec la valeur de l'autocomplétion
    let description = "**Règles :** Jeu amusant à jouer entre amis !";
    let emoji = "🎮";
    
    switch (jeuChoisi) {
      case "🤔 Préfères-tu":
        description = "**Règles :** Choisissez entre deux options !\n**Exemple :** Préfères-tu manger des glaces ou des gâteaux ?";
        emoji = "🤔";
        break;
      case "🙈 Je n'ai jamais":
        description = "**Règles :** Dites quelque chose que vous n'avez jamais fait !\n**Exemple :** Je n'ai jamais voyagé en avion !";
        emoji = "🙈";
        break;
      case "🧠 Quiz":
        description = "**Règles :** Répondez aux questions de culture générale !\n**Exemple :** Quelle est la capitale de la France ?";
        emoji = "🧠";
        break;
      case "💀 Action ou Vérité":
        description = "**Règles :** Choisissez entre faire une action ou dire la vérité !\n**Exemple :** Action : Faire 10 pompes | Vérité : Qui est votre crush ?";
        emoji = "💀";
        break;
      case "🤷 Que ferais-tu":
        description = "**Règles :** Imaginez ce que vous feriez dans une situation donnée !\n**Exemple :** Que ferais-tu si tu gagnais au loto ?";
        emoji = "🤷";
        break;
      default:
        description = "**Règles :** Jeu amusant à jouer entre amis !\n**Comment jouer :** Suivez les instructions du jeu choisi !";
        emoji = "🎮";
        break;
    }

    const embed = new EmbedBuilder()
      .setColor(colors.primary)
      .setTitle(`${emoji} ${jeuChoisi}`)
      .setDescription(description)
      .addFields(
        {
          name: "🎯 **Comment jouer**",
          value: "Invitez vos amis et commencez à jouer !",
          inline: true
        },
        {
          name: "👥 **Joueurs recommandés**",
          value: "2-10 personnes",
          inline: true
        },
        {
          name: "⏱️ **Durée**",
          value: "5-30 minutes",
          inline: true
        }
      )
      .setFooter({ 
        text: "Clarity Bot • Jeux amusants", 
        iconURL: client.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  },
};
