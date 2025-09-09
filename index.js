const BoilerplateClient = require("./src/util/client");
const ChalkAdvanced = require("chalk-advanced");

const client = new BoilerplateClient();

client.loginBot().then(() => {
  console.log(
    `${ChalkAdvanced.white("Clarity Bot")} ${ChalkAdvanced.gray(
      ">"
    )} ${ChalkAdvanced.green("Clarity démarré avec succès !")}`
  );
});
