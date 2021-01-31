const config = require('./config.json');

const Discord = require('discord.js');
const client = new Discord.Client()

client.on('ready', () => console.log(`Ready. Logged as ${client.user.tag} in ${client.guilds.cache.size} servers.`));

const actionsDescriptions = {
    'ADD_TITLE': 'Add a title to your embed.',
    'ADD_IMAGE': 'Add an image to your embed.',
    'ADD_DESCRIPTION': 'Add a description to your embed.',
    'ADD_URL': 'Add a URL to your embed.',
    'ADD_FOOTER': 'Add a footer to your embed.',
    'CHANGE_COLOR': 'Change the color of your embed.',
    'ADD_ICON': 'Add an icon to your embed.',
    'CANCEL': 'Cancel the creation of your embed.',
    'CONFIRM': 'Confirm your embed.'
}

const embedActions = {
    '🌆': 'ADD_IMAGE',
    '📌': 'ADD_TITLE',
    '🖊': 'ADD_DESCRIPTION',
    '🖥': 'ADD_URL',
    '✏': 'ADD_FOOTER',
    '☀': 'CHANGE_COLOR',
    '🤵': 'ADD_ICON',
    '': '',
    '❌': 'CANCEL',
    '✅': 'CONFIRM'
}

const helpMessage = `
Click on a reaction to adjust your embed!

${Object.keys(embedActions).map((a) => !a ? '' : `${a} ● ${actionsDescriptions[embedActions[a]]}`).join('\n')}
`;

client.on('message', async (message) => {

    if (!message.content.startsWith('%%')) return;
    
    const args = message.content.slice(2).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === 'embed') {

        let embed = new Discord.MessageEmbed();

        // Send the help message
        const help = await message.channel.send(helpMessage);

        // Add the reactions
        Object.keys(embedActions).filter((r) => r).forEach((r) => help.react(r));

        // wait for the user to react
        const collector = help.createReactionCollector((reaction, user) => user.id === message.author.id && Object.keys(embedActions).some((r) => r === reaction.emoji.name));
        collector.on('collect', (reaction, user) => {

            reaction.users.remove(user.id);

            const action = embedActions[reaction.emoji.name];
            
            switch (action) {

                case 'ADD_IMAGE':
                    message.reply('Add image?');
                    break;
                default:
                    message.reply('Unknown action?');

            }

        });

    }

});

client.login(config.token);
