const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const express = require("express");
require('dotenv').config();
const commands = require('./commands.json'); // Assure-toi que ce fichier contient un tableau de chaînes de caractères
const app = express();
const port = 3000;

// API Express pour vérifier que le bot est en ligne
app.get("/", (req, res) => {
    res.send("J'utilise les commandes slash maintenant");
});

// Initialisation du client Discord avec les bonnes intentions
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Liste des commandes slash
const slashCommands = [
    {
        name: 'hello',
        description: 'Envoie un message de salutations !',
    },
    // Ajoute d'autres commandes ici selon ton besoin
];

// Enregistrer les commandes slash au démarrage
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Début de l\'enregistrement des commandes slash...');

        // Enregistrement des commandes globales
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: slashCommands,
        });

        console.log('Commandes slash enregistrées avec succès.');
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des commandes slash:', error);
    }
})();

// Gestion des interactions slash
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'hello') {
        await interaction.reply('SLT !');
    }
});

// Lancer l'application Express pour vérifier si le bot est en ligne
app.listen(port, () => {
    console.info("Client en ligne !");
    client.login(process.env.DISCORD_TOKEN); // Connexion au bot Discord avec le token
});
