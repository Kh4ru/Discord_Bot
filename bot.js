const { Client, Events, GatewayIntentBits } = require('discord.js');
const express = require("express")
const commands = require('./commands.json')
const app = express()
const port = 3000;
app.get("/",(req,res) => {
	res.send("Le bot est en ligne :)")
})
const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });


client.on("messageCreate",(message) =>{
	if(message.author.bot) return;
	if(message.content.startsWith("!")&&commands.includes(message.content.substring(1,message.content.length))){
		switch(message.content.substring(1,message.content.length)){
			case "hello":
				message.reply("SLT")
		}
	}
})


app.listen(port,()=>{
	console.info("Client en ligne !")
	client.login(process.env.DISCORD_TOKEN);
})