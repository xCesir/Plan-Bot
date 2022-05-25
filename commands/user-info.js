const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = 
{
	data: new SlashCommandBuilder() // Comand REG
		.setName('user-info')
		.setDescription('Display info about yourself.'),

	async execute(interaction) // Funktion des Comands
	{
		try{
			return interaction.reply(`Your username: ${await(interaction.user.username)}\nYour ID: ${await(interaction.user.id)}`);
		} catch (error) {
			console.warn('Error while performing user-info')
			console.error(error)
		}
	},
};