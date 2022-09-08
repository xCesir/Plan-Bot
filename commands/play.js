const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const logger = require('../util/logger').log
const { QueryType } = require('discord-player');

module.exports = 
{
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('play a song')
		.addStringOption(option => option.setName('song').setDescription('add a song youtube link').setRequired(true)),

	async execute(interaction)
	{

		try{
			const { client } = require('../index');
			const channel = interaction.member.voice.channel;
			const song = interaction.options.getString('song');

			const playEmbed = new EmbedBuilder()
				.setColor('#e30926')
				.setTitle('Playing')
				.setDescription(`${await(interaction.user.username)} plays \n ${song} `)
				.setThumbnail('https://cdn-icons-png.flaticon.com/512/1384/1384060.png')

				const nosongEmbed = new EmbedBuilder()
				.setColor('#e30926')
				.setTitle('Error')
				.setDescription(`${await(interaction.user.username)} no song in Queue`)
				.setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Generic_error_message.png/250px-Generic_error_message.png')

				const voiceEmbed = new EmbedBuilder()
				.setColor('#e30926')
				.setTitle('Error')
				.setDescription(`${await(interaction.user.username)} You must be in a Voicechannel`)
				.setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Generic_error_message.png/250px-Generic_error_message.png')

				const guild = interaction.guild
				const searchResult = await client.player
					.search(song, {
						requestedBy: interaction.user.username,
						searchEngine: QueryType.AUTO
					})
					.catch(() => {
						console.log('he');
					});
					
				if (!searchResult || !searchResult.tracks.length) return void interaction.reply({ embeds: [nosongEmbed] });
		
				const queue = await client.player.createQueue(guild, {
					ytdlOptions: {
						filter: 'audioonly',
						highWaterMark: 1 << 30,
						dlChunkSize: 0,
					},
					metadata: channel
				});

				try {
					if (!queue.connection) await queue.connect(channel);
				} catch {
					void client.player.deleteQueue(guild.id);
					return void interaction.reply({ embeds: [voiceEmbed] });
				}
		
				await interaction.reply({ embeds: [playEmbed] });
				searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
				if (!queue.playing) await queue.play();
	

		}catch(error){
			logger.error('Error while performing play');
			console.log(error)
		}
	}
};