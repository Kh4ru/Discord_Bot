const { Client, GatewayIntentBits } = require('discord.js');
const express = require("express");
require('dotenv').config();
const commands = require('./commands.json'); // Assure-toi que ce fichier contient un tableau de chaînes de caractères
const Groq = require('groq');  // Importation de Groq pour générer des réponses
const app = express();
const port = 3000;

// API Express pour vérifier que le bot est en ligne
app.get("/", (req, res) => {
    res.send("Le bot est en ligne :)");
});

// Initialisation du client Discord avec les bonnes intentions
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Initialisation de l'API Groq
const groqClient = new Groq({
    api_key: process.env.GROQ_API_KEY,  // Assure-toi que la clé API Groq est dans le fichier .env
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return; // Ignore les messages des autres bots
    
    const command = message.content.substring(1); // Retire le "!" du début du message

    // Vérifie si la commande existe dans "commands.json" et si la commande est une chaîne de caractères
    if (message.content.startsWith("!") && typeof command === 'string' && commands.includes(command)) {
        switch (command) {
            case "hello":
                message.reply("SLT !");
                break;

            // Commande pour générer un message via Groq
            case "generate":
                try {
                    // Utilisation de Groq pour générer une réponse
                    const generatedResponse = await groqClient.chat.completions.create({
                        messages: [
                            {
                                role: "user",
                                content: "Ecris une réponse sympa pour un chatbot",
                            }
                        ],
                        model: "llama-3.3-70b-versatile", // Choix du modèle pour générer un texte
                    });

                    // Répondre avec la réponse générée par Groq
                    const responseText = generatedResponse.choices[0].message.content;
                    message.reply(responseText); // Envoie la réponse générée dans Discord
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
