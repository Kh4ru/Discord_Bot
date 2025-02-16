const { Client, GatewayIntentBits } = require('discord.js');
const express = require("express");
require('dotenv').config();
const commands = require('./commands.json');
const Groq = require('groq');  // Ajout de Groq pour la génération de texte
const app = express();
const port = 3000;

// Définition de l'API Express pour vérifier que le bot est en ligne
app.get("/", (req, res) => {
    res.send("Le bot est en ligne :) Il utilise Groq aussi !");
});

// Initialisation du client Discord avec les bonnes intentions
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Initialisation de l'API Groq
const groqClient = new Groq({
    api_key: process.env.GROQ_API_KEY,  // Assure-toi d'avoir configuré ta clé API Groq dans le fichier .env
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return; // Ignore les messages des autres bots
    
    // Vérifie si le message commence par "!" et si la commande existe dans "commands.json"
    const command = message.content.substring(1); // Supprime le "!" du début
    if (message.content.startsWith("!") && commands.includes(command)) {
        switch(command) {
            case "hello":
                message.reply("SLT !");
                break;

            // Commande pour générer un message via Groq
            case "generate":
                try {
                    const generatedResponse = await groqClient.chat.completions.create({
                        messages: [
                            {
                                role: "user",
                                content: "Ecris une réponse sympa pour un chatbot",
                            }
                        ],
                        model: "llama-3.3-70b-versatile", // Utilisation du modèle pour générer un texte
                    });

                    // Répondre avec la réponse générée par Groq
                    const responseText = generatedResponse.choices[0].message.content;
                    message.reply(responseText);  // Répond avec le texte généré par Groq
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

// Lancer l'application Express
app.listen(port, () => {
    console.info("Client en ligne !");
    client.login(process.env.DISCORD_TOKEN); // Se connecter avec le token de Discord
});
