const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const zmianakoloru = require('chalk');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`setup-ticket`)
        .setDescription('Tworzy nowy ticket'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setAuthor({ name: 'Kinius - Ticket System' }) 
        .setDescription('> Potrzebujesz pomocy? Wybierz rodzaj ticketu a pomożemy jak najszybciej!')
        .setFooter({ text: 'Kinius - Ticket System' }) 
        .setTimestamp();
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select-ticket')
            .setPlaceholder('Wybierz kategorię')
            .addOptions(
                {
                    label: 'PYTANIE',
                    description: 'Masz pytanie dotyczące serwera lub innego tematu.',
                    value: 'pytanie',
                },
                {
                    label: 'WSPÓŁPRACA',
                    description: 'Chcesz nawiązać współpracę.',
                    value: 'wspolpraca',
                },
                {
                    label: 'INNE',
                    description: 'Inny temat, który nie pasuje do powyższych.',
                    value: 'inne',
                }
            );

        const row = new ActionRowBuilder()
            .addComponents(selectMenu);

        await interaction.channel.send({ embeds: [embed], components: [row] });

        interaction.client.on('interactionCreate', async (selectInteraction) => {
            if (!selectInteraction.isStringSelectMenu()) return;
            if (selectInteraction.customId === 'select-ticket') {
                console.log(zmianakoloru.green(`[SUCCES] Ticket został utworzony przez `) + zmianakoloru.red(selectInteraction.user.tag));
            }
        });
    },
};
