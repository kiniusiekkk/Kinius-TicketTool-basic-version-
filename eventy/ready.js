const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const zmianakoloru = require('chalk');
const { ActivityType } = require('discord.js')
const kochamsiudka = [
    { name: 'Anime Zjebów', type: ActivityType.Watching },
    { name: 'Tomb Rajder', type: ActivityType.Playing },
    { name: 'Metro boomina', type: ActivityType.Listening },
  ];
  let i = 0;

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(zmianakoloru.red(`[LOG-IN] Zalogowano jako ${client.user.tag}`));
        setInterval(() => {
            client.user.setPresence({
              activities: [kochamsiudka[i]],
              status: 'dnd'
            });
            i = (i + 1) % kochamsiudka.length;
          }, 5000);
        const CLIENT_ID = client.user.id;
        const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

        (async () => {
            try {
                const commandData = client.commands.map(cmd => cmd.data.toJSON());
        
                if (process.env.GUILD_ID) {
                    await rest.put(
                        Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID),
                        { body: commandData },
                    );
                    console.log(zmianakoloru.green('[SUCCES] Zarejestrowano komendy dla serwera.'));
                } else {
                    await rest.put(
                        Routes.applicationCommands(CLIENT_ID),
                        { body: commandData },
                    );
                    console.log(zmianakoloru.green('[SUCCES] Zarejestrowano globalne komendy.'));
                }
            } catch (error) {
                console.error(error);
            }
        })();
        
    },
};
