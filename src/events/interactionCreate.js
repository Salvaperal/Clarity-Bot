module.exports = async (client, interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      command.execute(interaction, client);
    } catch (err) {
      if (err) console.error(err);
      interaction.reply({
        content: "Une erreur s'est produite lors de l'exécution de cette commande.",
        ephemeral: true,
      });
    }
  } else if (interaction.isAutocomplete()) {
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`Aucune commande correspondant à ${interaction.commandName} n'a été trouvée.`);
			return;
		}

		try {
			await command.autocomplete(interaction);
		} catch (error) {
			console.error(error);
		}
  } else if (interaction.isButton()) {
    // Ignorer les boutons de la commande help (gérés par la commande elle-même)
    if (interaction.customId.startsWith("help_")) {
      return;
    }

    const button = client.buttons.get(interaction.customId);
    if (!button) return;
    
    try {
      button.execute(interaction, client);
    } catch (err) {
      if (err) console.error(err);
      if (!interaction.replied && !interaction.deferred) {
        interaction.reply({
          content: "Une erreur s'est produite lors de l'exécution de ce bouton.",
          ephemeral: true,
        });
      }
    }
  } else if (interaction.isSelectMenu()) {
    const button = client.buttons.get(interaction.customId);
    if (button) return button.execute(interaction, client);
  }
};
