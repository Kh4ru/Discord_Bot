const { Client, GatewayIntentBits } = require('discord.js');
const express = require("express");
const axios = require("axios"); // Importation de axios
require('dotenv').config();
const commands = require('./commands.json'); // Assure-toi que ce fichier contient un tableau de chaînes de caractères
const app = express();
const port = 3000;

// API Express pour vérifier que le bot est en ligne
app.get("/", (req, res) => {
    res.send("Le bot est en ligne :)");
});

// Initialisation du client Discord avec les bonnes intentions
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on("messageCreate", async (message) => {
    if (message.author.bot) return; // Ignore les messages des autres bots
    
    const command = message.content.substring(1); // Retire le "!" du début du message

    // Vérifie si la commande existe dans "commands.json" et si la commande est une chaîne de caractères
    if (message.content.startsWith("!") && typeof command === 'string' && commands.includes(command)) {
        switch (command) {
            case "hello":
                message.reply("SLT !");
                break;

            // Commande pour générer un message via Groq en utilisant axios
            case "generate":
                try {
                    // Effectuer la requête avec axios, comme un curl
                    const response = await axios.post(
                        'https://api.groq.com/openai/v1/chat/completions',
                        {
                            messages: [
                                {
                                    role: "user",
                                    content: "Explain the importance of fast language models"
                                }
                            ],
                            model: "llama-3.3-70b-versatile"
                        },
                        {
                            headers: {
                                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                                "Content-Type": "application/json"
                            }
                        }
                    );

                    // Envoie la réponse générée par Groq
                    const generatedResponse = response.data.choices[0].message.content;
                    message.reply(generatedResponse); // Envoie la réponse générée dans Discord
                } catch (error) {
                    console.error("Erreur de génération avec Groq:", error);
                    message.reply("Désolé, je n'ai pas pu générer une réponse.");
                }
                break;

            default:
                message.reply("Commande non reconnue !");
        }
    }
});

// Lancer l'application Express pour vérifier si le bot est en ligne
app.listen(port, () => {
    console.info("Client en ligne !");
    client.login(process.env.DISCORD_TOKEN); // Connexion au bot Discord avec le token
});
