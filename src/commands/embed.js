const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("🎨 Créateur d'embed interactif et moderne")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction, client) {
    // Vérifier si l'utilisateur est autorisé
    const authorizedUserId = "601337312714031124";
    if (interaction.user.id !== authorizedUserId) {
      return interaction.reply({
        content: "🚧 **Commande en développement**\n\nCette commande est actuellement en cours de développement et n'est pas encore disponible pour le public.\n\n*Merci de votre compréhension !*",
        ephemeral: true
      });
    }

    // Embed de construction
    const constructionEmbed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("🎨 Créateur d'Embed Clarity")
      .setDescription("**Bienvenue dans le créateur d'embed interactif !**\n\n**Instructions :**\n• Sélectionnez une option dans le menu déroulant\n• Suivez les instructions pour personnaliser votre embed\n• Cliquez sur **Envoyer** quand vous êtes satisfait\n\n**Commandes spéciales :**\n• Tapez `remove` pour supprimer un élément\n• Tapez `cancel` pour annuler une modification")
      .addFields(
        {
          name: "📋 **Fonctionnalités disponibles**",
          value: "• Titre et URL\n• Description\n• Auteur et icône\n• Pied de page\n• Thumbnail et image\n• Couleur personnalisée\n• Timestamp\n• Champs personnalisés",
          inline: false
        },
        {
          name: "🎯 **Statut**",
          value: "Prêt à créer votre embed !",
          inline: true
        }
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setFooter({ 
        text: `Créateur d'embed • ${interaction.user.username}`, 
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    // Embed de test (vide au début)
    let testEmbed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setDescription("**Votre embed apparaîtra ici !**\nUtilisez le menu ci-dessous pour le personnaliser.")
      .setFooter({ text: "Aperçu en temps réel" });

    // Menu de sélection
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("embed_builder")
      .setPlaceholder("🎨 Que voulez-vous modifier ?")
      .setOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("📝 Titre et URL")
          .setDescription("Définir le titre et l'URL de l'embed")
          .setEmoji("📝")
          .setValue("title"),
        new StringSelectMenuOptionBuilder()
          .setLabel("💬 Description")
          .setDescription("Modifier la description principale")
          .setEmoji("💬")
          .setValue("description"),
        new StringSelectMenuOptionBuilder()
          .setLabel("👤 Auteur")
          .setDescription("Définir l'auteur et son icône")
          .setEmoji("👤")
          .setValue("author"),
        new StringSelectMenuOptionBuilder()
          .setLabel("🔻 Pied de page")
          .setDescription("Modifier le texte du pied de page")
          .setEmoji("🔻")
          .setValue("footer"),
        new StringSelectMenuOptionBuilder()
          .setLabel("🖼️ Thumbnail")
          .setDescription("Ajouter une miniature")
          .setEmoji("🖼️")
          .setValue("thumbnail"),
        new StringSelectMenuOptionBuilder()
          .setLabel("🌄 Image")
          .setDescription("Ajouter une image principale")
          .setEmoji("🌄")
          .setValue("image"),
        new StringSelectMenuOptionBuilder()
          .setLabel("🎨 Couleur")
          .setDescription("Changer la couleur de l'embed")
          .setEmoji("🎨")
          .setValue("color"),
        new StringSelectMenuOptionBuilder()
          .setLabel("⏰ Timestamp")
          .setDescription("Activer/désactiver l'horodatage")
          .setEmoji("⏰")
          .setValue("timestamp"),
        new StringSelectMenuOptionBuilder()
          .setLabel("➕ Ajouter un champ")
          .setDescription("Créer un nouveau champ")
          .setEmoji("➕")
          .setValue("add_field"),
        new StringSelectMenuOptionBuilder()
          .setLabel("➖ Supprimer un champ")
          .setDescription("Supprimer un champ existant")
          .setEmoji("➖")
          .setValue("remove_field"),
        new StringSelectMenuOptionBuilder()
          .setLabel("🔄 Réinitialiser")
          .setDescription("Remettre à zéro l'embed")
          .setEmoji("🔄")
          .setValue("reset")
      );

    // Boutons
    const sendButton = new ButtonBuilder()
      .setCustomId("send_embed")
      .setLabel("📤 Envoyer l'embed")
      .setStyle(2) // Success
      .setEmoji("📤");

    const previewButton = new ButtonBuilder()
      .setCustomId("preview_embed")
      .setLabel("👁️ Aperçu")
      .setStyle(1) // Primary
      .setEmoji("👁️");

    const clearButton = new ButtonBuilder()
      .setCustomId("clear_embed")
      .setLabel("🗑️ Effacer")
      .setStyle(4) // Danger
      .setEmoji("🗑️");

    const rows = [
      new ActionRowBuilder().addComponents(selectMenu),
      new ActionRowBuilder().addComponents(sendButton, previewButton, clearButton)
    ];

    const response = await interaction.reply({
      embeds: [constructionEmbed, testEmbed],
      components: rows,
      fetchReply: true
    });

    // Variables pour stocker l'état de l'embed
    let embedData = {
      title: null,
      url: null,
      description: null,
      author: { name: null, iconURL: null, url: null },
      footer: { text: null, iconURL: null },
      thumbnail: null,
      image: null,
      color: 0x5865f2,
      timestamp: false,
      fields: []
    };

    // Fonction pour mettre à jour l'embed de test
    function updateTestEmbed() {
      const newEmbed = new EmbedBuilder();
      
      if (embedData.title) newEmbed.setTitle(embedData.title);
      if (embedData.url) newEmbed.setURL(embedData.url);
      if (embedData.description) newEmbed.setDescription(embedData.description);
      if (embedData.author.name) newEmbed.setAuthor(embedData.author);
      if (embedData.footer.text) newEmbed.setFooter(embedData.footer);
      if (embedData.thumbnail) newEmbed.setThumbnail(embedData.thumbnail);
      if (embedData.image) newEmbed.setImage(embedData.image);
      if (embedData.color) newEmbed.setColor(embedData.color);
      if (embedData.timestamp) newEmbed.setTimestamp();
      if (embedData.fields.length > 0) newEmbed.addFields(embedData.fields);
      
      if (!embedData.title && !embedData.description && embedData.fields.length === 0) {
        newEmbed.setDescription("**Votre embed apparaîtra ici !**\nUtilisez le menu ci-dessous pour le personnaliser.");
      }
      
      return newEmbed;
    }

    // Fonction pour valider une couleur
    function isValidColor(color) {
      const colorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
      return colorRegex.test(color) || color === "random" || color === "rainbow";
    }

    // Fonction pour obtenir une couleur
    function getColor(color) {
      if (color === "random") return Math.floor(Math.random() * 16777215);
      if (color === "rainbow") return 0x5865f2; // Couleur par défaut pour rainbow
      return parseInt(color.replace("#", ""), 16);
    }

    // Collecteur d'interactions
    const collector = response.createMessageComponentCollector({ time: 300000 }); // 5 minutes

    // Gestion des modals et sélections dans le collecteur principal
    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: "❌ Vous ne pouvez pas utiliser cette commande !", ephemeral: true });
      }

      // Gestion des menus de sélection
      if (i.isStringSelectMenu()) {
        const value = i.values[0];

        switch (value) {
          case "title":
            const titleModal = new ModalBuilder()
              .setCustomId("title_modal")
              .setTitle("📝 Titre et URL")
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("title_input")
                    .setLabel("Titre de l'embed")
                    .setStyle(1)
                    .setPlaceholder("Entrez le titre...")
                    .setValue(embedData.title || "")
                    .setRequired(false)
                    .setMaxLength(256)
                ),
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("url_input")
                    .setLabel("URL (optionnel)")
                    .setStyle(1)
                    .setPlaceholder("https://exemple.com")
                    .setValue(embedData.url || "")
                    .setRequired(false)
                    .setMaxLength(512)
                )
              );
            await i.showModal(titleModal);
            return;

          case "description":
            const descModal = new ModalBuilder()
              .setCustomId("desc_modal")
              .setTitle("💬 Description")
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("desc_input")
                    .setLabel("Description de l'embed")
                    .setStyle(2)
                    .setPlaceholder("Entrez la description...")
                    .setValue(embedData.description || "")
                    .setRequired(false)
                    .setMaxLength(4000)
                )
              );
            await i.showModal(descModal);
            return;

          case "author":
            const authorModal = new ModalBuilder()
              .setCustomId("author_modal")
              .setTitle("👤 Auteur")
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("author_name")
                    .setLabel("Nom de l'auteur")
                    .setStyle(1)
                    .setPlaceholder("Nom de l'auteur...")
                    .setValue(embedData.author.name || "")
                    .setRequired(false)
                    .setMaxLength(256)
                ),
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("author_icon")
                    .setLabel("URL de l'icône (optionnel)")
                    .setStyle(1)
                    .setPlaceholder("https://exemple.com/image.png")
                    .setValue(embedData.author.iconURL || "")
                    .setRequired(false)
                    .setMaxLength(512)
                ),
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("author_url")
                    .setLabel("URL de l'auteur (optionnel)")
                    .setStyle(1)
                    .setPlaceholder("https://exemple.com")
                    .setValue(embedData.author.url || "")
                    .setRequired(false)
                    .setMaxLength(512)
                )
              );
            await i.showModal(authorModal);
            return;

          case "footer":
            const footerModal = new ModalBuilder()
              .setCustomId("footer_modal")
              .setTitle("🔻 Pied de page")
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("footer_text")
                    .setLabel("Texte du pied de page")
                    .setStyle(1)
                    .setPlaceholder("Texte du pied de page...")
                    .setValue(embedData.footer.text || "")
                    .setRequired(false)
                    .setMaxLength(2048)
                ),
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("footer_icon")
                    .setLabel("URL de l'icône (optionnel)")
                    .setStyle(1)
                    .setPlaceholder("https://exemple.com/image.png")
                    .setValue(embedData.footer.iconURL || "")
                    .setRequired(false)
                    .setMaxLength(512)
                )
              );
            await i.showModal(footerModal);
            return;

          case "thumbnail":
            const thumbModal = new ModalBuilder()
              .setCustomId("thumb_modal")
              .setTitle("🖼️ Thumbnail")
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("thumb_url")
                    .setLabel("URL de la miniature")
                    .setStyle(1)
                    .setPlaceholder("https://exemple.com/image.png")
                    .setValue(embedData.thumbnail || "")
                    .setRequired(false)
                    .setMaxLength(512)
                )
              );
            await i.showModal(thumbModal);
            return;

          case "image":
            const imageModal = new ModalBuilder()
              .setCustomId("image_modal")
              .setTitle("🌄 Image")
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("image_url")
                    .setLabel("URL de l'image")
                    .setStyle(1)
                    .setPlaceholder("https://exemple.com/image.png")
                    .setValue(embedData.image || "")
                    .setRequired(false)
                    .setMaxLength(512)
                )
              );
            await i.showModal(imageModal);
            return;

          case "color":
            const colorModal = new ModalBuilder()
              .setCustomId("color_modal")
              .setTitle("🎨 Couleur")
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("color_input")
                    .setLabel("Couleur (hex: #FFFFFF, random, rainbow)")
                    .setStyle(1)
                    .setPlaceholder("#FFFFFF, random, rainbow")
                    .setValue(embedData.color ? `#${embedData.color.toString(16).padStart(6, '0')}` : "#5865f2")
                    .setRequired(false)
                    .setMaxLength(20)
                )
              );
            await i.showModal(colorModal);
            return;

          case "timestamp":
            await i.deferUpdate();
            embedData.timestamp = !embedData.timestamp;
            await i.editReply({ embeds: [constructionEmbed, updateTestEmbed()], components: rows });
            return;

          case "add_field":
            const fieldModal = new ModalBuilder()
              .setCustomId("field_modal")
              .setTitle("➕ Nouveau champ")
              .addComponents(
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("field_name")
                    .setLabel("Nom du champ")
                    .setStyle(1)
                    .setPlaceholder("Nom du champ...")
                    .setRequired(true)
                    .setMaxLength(256)
                ),
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("field_value")
                    .setLabel("Valeur du champ")
                    .setStyle(2)
                    .setPlaceholder("Valeur du champ...")
                    .setRequired(true)
                    .setMaxLength(1024)
                ),
                new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setCustomId("field_inline")
                    .setLabel("En ligne ? (true/false)")
                    .setStyle(1)
                    .setPlaceholder("true ou false")
                    .setValue("true")
                    .setRequired(false)
                    .setMaxLength(5)
                )
              );
            await i.showModal(fieldModal);
            return;

          case "remove_field":
            await i.deferUpdate();
            if (embedData.fields.length === 0) {
              return i.followUp({ content: "❌ Aucun champ à supprimer !", ephemeral: true });
            }
            
            const fieldSelect = new StringSelectMenuBuilder()
              .setCustomId("remove_field_select")
              .setPlaceholder("Sélectionnez un champ à supprimer")
              .setOptions(
                embedData.fields.map((field, index) => 
                  new StringSelectMenuOptionBuilder()
                    .setLabel(field.name)
                    .setDescription(field.value.substring(0, 50) + "...")
                    .setValue(index.toString())
                )
              );
            
            const fieldRow = new ActionRowBuilder().addComponents(fieldSelect);
            await i.followUp({ content: "Sélectionnez le champ à supprimer :", components: [fieldRow], ephemeral: true });
            return;

          case "reset":
            await i.deferUpdate();
            embedData = {
              title: null,
              url: null,
              description: null,
              author: { name: null, iconURL: null, url: null },
              footer: { text: null, iconURL: null },
              thumbnail: null,
              image: null,
              color: 0x5865f2,
              timestamp: false,
              fields: []
            };
            await i.editReply({ embeds: [constructionEmbed, updateTestEmbed()], components: rows });
            return;
        }
      }

      // Gestion des boutons
      if (i.isButton()) {
        await i.deferUpdate();
        
        switch (i.customId) {
          case "send_embed":
            const channelSelect = new StringSelectMenuBuilder()
              .setCustomId("channel_select")
              .setPlaceholder("Sélectionnez un salon")
              .setOptions(
                interaction.guild.channels.cache
                  .filter(channel => channel.type === ChannelType.GuildText)
                  .map(channel => 
                    new StringSelectMenuOptionBuilder()
                      .setLabel(`#${channel.name}`)
                      .setValue(channel.id)
                  )
                  .slice(0, 25)
              );
            
            const channelRow = new ActionRowBuilder().addComponents(channelSelect);
            await i.followUp({ content: "Sélectionnez le salon où envoyer l'embed :", components: [channelRow], ephemeral: true });
            return;

          case "preview_embed":
            await i.followUp({ embeds: [updateTestEmbed()], ephemeral: true });
            return;

          case "clear_embed":
            embedData = {
              title: null,
              url: null,
              description: null,
              author: { name: null, iconURL: null, url: null },
              footer: { text: null, iconURL: null },
              thumbnail: null,
              image: null,
              color: 0x5865f2,
              timestamp: false,
              fields: []
            };
            await i.editReply({ embeds: [constructionEmbed, updateTestEmbed()], components: rows });
            return;
        }
      }

      // Gestion des modals
      if (i.isModalSubmit()) {
        try {
          switch (i.customId) {
            case "title_modal":
              const title = i.fields.getTextInputValue("title_input");
              const url = i.fields.getTextInputValue("url_input");
              
              embedData.title = title || null;
              embedData.url = url || null;
              
              await i.reply({ content: "✅ Titre mis à jour !", ephemeral: true });
              await response.edit({ embeds: [constructionEmbed, updateTestEmbed()], components: rows });
              break;

            case "desc_modal":
              const description = i.fields.getTextInputValue("desc_input");
              embedData.description = description || null;
              
              await i.reply({ content: "✅ Description mise à jour !", ephemeral: true });
              await response.edit({ embeds: [constructionEmbed, updateTestEmbed()], components: rows });
              break;

            case "author_modal":
              const authorName = i.fields.getTextInputValue("author_name");
              const authorIcon = i.fields.getTextInputValue("author_icon");
              const authorUrl = i.fields.getTextInputValue("author_url");
              
              embedData.author = {
                name: authorName || null,
                iconURL: authorIcon || null,
                url: authorUrl || null
              };
              
              await i.reply({ content: "✅ Auteur mis à jour !", ephemeral: true });
              await response.edit({ embeds: [constructionEmbed, updateTestEmbed()], components: rows });
              break;

            case "footer_modal":
              const footerText = i.fields.getTextInputValue("footer_text");
              const footerIcon = i.fields.getTextInputValue("footer_icon");
              
              embedData.footer = {
                text: footerText || null,
                iconURL: footerIcon || null
              };
              
              await i.reply({ content: "✅ Pied de page mis à jour !", ephemeral: true });
              await response.edit({ embeds: [constructionEmbed, updateTestEmbed()], components: rows });
              break;

            case "thumb_modal":
              const thumbnail = i.fields.getTextInputValue("thumb_url");
              embedData.thumbnail = thumbnail || null;
              
              await i.reply({ content: "✅ Thumbnail mise à jour !", ephemeral: true });
              await response.edit({ embeds: [constructionEmbed, updateTestEmbed()], components: rows });
              break;

            case "image_modal":
              const image = i.fields.getTextInputValue("image_url");
              embedData.image = image || null;
              
              await i.reply({ content: "✅ Image mise à jour !", ephemeral: true });
              await response.edit({ embeds: [constructionEmbed, updateTestEmbed()], components: rows });
              break;

            case "color_modal":
              const colorInput = i.fields.getTextInputValue("color_input");
              
              if (isValidColor(colorInput)) {
                embedData.color = getColor(colorInput);
                await i.reply({ content: "✅ Couleur mise à jour !", ephemeral: true });
                await response.edit({ embeds: [constructionEmbed, updateTestEmbed()], components: rows });
              } else {
                await i.reply({ content: "❌ Couleur invalide ! Utilisez le format #FFFFFF, 'random' ou 'rainbow'", ephemeral: true });
              }
              break;

            case "field_modal":
              const fieldName = i.fields.getTextInputValue("field_name");
              const fieldValue = i.fields.getTextInputValue("field_value");
              const fieldInline = i.fields.getTextInputValue("field_inline").toLowerCase() === "true";
              
              embedData.fields.push({ name: fieldName, value: fieldValue, inline: fieldInline });
              
              await i.reply({ content: "✅ Champ ajouté !", ephemeral: true });
              await response.edit({ embeds: [constructionEmbed, updateTestEmbed()], components: rows });
              break;
          }
        } catch (error) {
          console.error("Erreur lors de la gestion du modal :", error);
          await i.reply({ content: "❌ Une erreur s'est produite !", ephemeral: true });
        }
        return;
      }

      // Gestion des sélections de salon et suppression de champs
      if (i.isStringSelectMenu()) {
        if (i.customId === "channel_select") {
          const channelId = i.values[0];
          const channel = interaction.guild.channels.cache.get(channelId);
          
          if (channel) {
            try {
              await channel.send({ embeds: [updateTestEmbed()] });
              await i.reply({ content: `✅ Embed envoyé dans ${channel} !`, ephemeral: true });
            } catch (error) {
              await i.reply({ content: "❌ Impossible d'envoyer l'embed dans ce salon !", ephemeral: true });
            }
          }
          return;
        }

        if (i.customId === "remove_field_select") {
          const fieldIndex = parseInt(i.values[0]);
          embedData.fields.splice(fieldIndex, 1);
          
          await i.reply({ content: "✅ Champ supprimé !", ephemeral: true });
          await response.edit({ embeds: [constructionEmbed, updateTestEmbed()], components: rows });
          return;
        }
      }
    });

    // Timeout
    collector.on("end", () => {
      const timeoutEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("⏰ Session expirée")
        .setDescription("Le créateur d'embed a expiré. Utilisez `/embed` pour en créer un nouveau.")
        .setTimestamp();

      response.edit({ embeds: [timeoutEmbed], components: [] }).catch(() => {});
    });
  },
};
