const fs = require("fs");
const path = require("path");

module.exports = class CommandHandler {
  constructor(client) {
    this.client = client;
  }

  load() {
    const commandsPath = path.join(__dirname, "..", "commands");
    
    if (!fs.existsSync(commandsPath)) {
      console.log("Clarity Bot > Aucun dossier 'commands' trouvé");
      return;
    }

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
    
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      
      if ("data" in command && "execute" in command) {
        this.client.commands.set(command.data.name, command);
        console.log(`Clarity Bot > Commande chargée : ${command.data.name}`);
      } else {
        console.log(`Clarity Bot > [ATTENTION] La commande ${file} manque une propriété "data" ou "execute" requise.`);
      }
    }

    console.log(`Clarity Bot > ${this.client.commands.size} commandes chargées avec succès`);
  }
};
