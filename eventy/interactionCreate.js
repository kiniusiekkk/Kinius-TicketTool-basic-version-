const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const zmianakoloru = require('chalk');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'select-ticket') {
                let nazwakanalu = `ticket-ks-${interaction.user.username}`;
                const czyosobamakanal = interaction.guild.channels.cache.find(channel =>
                    channel.name.includes(`ticket-`) && channel.name.includes(interaction.user.username)
                );
                if (czyosobamakanal) return;
                
                const channel = await interaction.guild.channels.create({
                    name: nazwakanalu,
                    type: 0, 
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone.id,
                            deny: [PermissionsBitField.Flags.ViewChannel], 
                        },
                        {
                            id: interaction.user.id,
                            allow: [
                                PermissionsBitField.Flags.ViewChannel, 
                                PermissionsBitField.Flags.SendMessages
                            ], 
                        },
                    ],
                });

                const embed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle(`Ticket System`)
                    .setDescription(`Cześć ${interaction.user}, to jest Twój ticket!. Opisz swój problem tutaj.`)
                    .setTimestamp();
                const closeButton = new ButtonBuilder()
                    .setCustomId('close-ticket')
                    .setLabel('Zamknij Ticket')
                    .setStyle(ButtonStyle.Danger);

                const row = new ActionRowBuilder()
                    .addComponents(closeButton);
                await channel.send({ content: `${interaction.user}`, embeds: [embed], components: [row] });
                console.log(zmianakoloru.green(`[SUCCES] Stworzono ticket `) + zmianakoloru.red(nazwakanalu) + zmianakoloru.green(` przez ${interaction.user.tag}`));
            }
        } else if (interaction.isButton()) {
            if (interaction.customId === 'close-ticket') {
                const embedConfirm = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle('Potwierdzenie zamknięcia')
                    .setDescription('Czy na pewno chcesz zamknąć ten ticket?')
                    .setTimestamp();
                const confirmRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('przycisk-do-zamkniecia-TAK')
                            .setLabel('TAK')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('przycisk-do-zamkniecia-NIE')
                            .setLabel('NIE')
                            .setStyle(ButtonStyle.Secondary)
                    );
                await interaction.update({ embeds: [embedConfirm], components: [confirmRow] });
            } else if (interaction.customId === 'przycisk-do-zamkniecia-TAK') {
                await interaction.channel.delete();
            } else if (interaction.customId === 'przycisk-do-zamkniecia-NIE') {
                try {
                    const embed = new EmbedBuilder()
                        .setColor(0x0099ff)
                        .setTitle(`Ticket System`)
                        .setDescription(`Cześć ${interaction.user}, to jest Twój ticket jest rozpatrywany. Opisz swój problem tutaj.`)
                        .setTimestamp();
                        const siudekgej = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId('close-ticket')
                            .setLabel('Zamknij Ticket')
                            .setStyle(ButtonStyle.Danger)
                        );
                    await interaction.update({
                        content: `${interaction.user.tag}`,
                        embeds: [embed],
                        components: [siudekgej],
                        ephemeral: true
                    });
                } catch (error) {
                    console.error(error);
                }
            }
            
        }
    },
};
