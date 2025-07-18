import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, Collection, EmbedBuilder, GuildMember, Message, MessageFlags, PermissionFlagsBits, TextChannel } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class Clear extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "clear",
            description: "Delete certain messages from a user",
            category: Category.Moderation,
            default_member_permissions: PermissionFlagsBits.ManageMessages,
            options: [
                {
                    name: "amount",
                    description: "Select an amount of messages to delete - Limit: 100",
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                },
                {
                    name: "target",
                    description: "Select a target to delete their messages",
                    type: ApplicationCommandOptionType.User,
                    required: false,
                },
                {
                    name: "channel",
                    description: "Select a channel to delete from - Default current channel",
                    type: ApplicationCommandOptionType.Channel,
                    required: false,
                    channel_types: [ChannelType.GuildText],
                },
                {
                    name: "silent",
                    description: "Don't send a message to the channel",
                    type: ApplicationCommandOptionType.Boolean,
                    required: false,
                }
            ],
            cooldown: 3,
            dm_premissions: false,
            dev: false
        });
    }
    async Execute(interaction: ChatInputCommandInteraction) {
        let amount = interaction.options.getInteger("amount")!;
        const channel = (interaction.options.getChannel("channel") || interaction.channel) as TextChannel;
        const target = interaction.options.getMember("target") as GuildMember;
        const silent = interaction.options.getBoolean("silent") || false;

        const errorEmbed = new EmbedBuilder().setColor("Red");

        if(amount < 1 || amount > 100) 
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(`⛔ You can only delete between 1 and 100 messages at a time!`)
            ], flags: MessageFlags.Ephemeral });
        
        const messages: Collection<string, Message<true>> = await channel.messages.fetch({ limit: 100 })

        var filteredMessages = target ? messages.filter(m => m.author.id === target.id) : messages;
        let deleted = 0;

        try {
            deleted = (await channel.bulkDelete(Array.from(filteredMessages.keys()).slice(0, amount), true)).size;
        } catch {
            return interaction.reply({ embeds: [errorEmbed
                .setDescription("⛔ An error occured while trying to delete messages!")
            ], flags: MessageFlags.Ephemeral })
        }

        interaction.reply({ embeds: [new EmbedBuilder()
            .setColor("Orange")
            .setDescription(`🧹 **Deleted** \`${deleted}\` messages${target ? ` from ${target}` : ""} in ${channel}`)
        ], flags: MessageFlags.Ephemeral })

        if(!silent)
            channel.send({ embeds: [new EmbedBuilder()
                .setColor("Orange")
                .setAuthor({ name: `🧹 Clear | ${channel.name}`})
                .setDescription(`**Deleted** \`${deleted}\` messages`)
                .setTimestamp()
                .setFooter({
                    text: `Messages: ${target ? target.user.tag : "All"} messages`
                })
            ]})
            .then(async(msg) => await msg.react("🧹"))
        
        const guild = await GuildConfig.findOne({ guildId: interaction.guildId });

        if(guild && guild?.logs?.moderation?.enabled && guild?.logs?.moderation?.channelId)
            (await interaction.guild?.channels.fetch(guild?.logs?.moderation?.channelId) as TextChannel)?.send({
                embeds: [new EmbedBuilder()
                    .setColor("Orange")
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setAuthor({ name: "🧹 Clear"})
                    .setDescription(`
                    **Channel:** ${channel} - \`${channel.id}\`
                    **Messages:** ${target ? target : "All"}
                    **Ammount:** \`${deleted}\`\
                    `)
                    .setTimestamp()
                    .setFooter({
                        text: `Actioned by ${interaction.user.tag} | ${interaction.user.id}`,
                        iconURL:interaction.user.displayAvatarURL()
                    })
                ]
            })
    }
}