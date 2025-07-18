import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits, TextChannel } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class Slowmode extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "slowmode",
            description: "Set the slowmode for a channel",
            category: Category.Moderation,
            default_member_permissions: PermissionFlagsBits.ManageChannels,
            options: [
                {
                    name: "rate",
                    description: "Select the slowmode message rate",
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                    choices: [
                        { name: "None", value: "0" },
                        { name: "5 seconds", value: "5" },
                        { name: "10 seconds", value: "10" },
                        { name: "15 seconds", value: "15" },
                        { name: "30 seconds", value: "30" },
                        { name: "1 Minute", value: "60" },
                        { name: "2 Minutes", value: "120" },
                        { name: "5 Minutes", value: "300" },
                        { name: "10 Minutes", value: "600" },
                        { name: "15 Minutes", value: "900" },
                        { name: "30 Minutes", value: "1800" },
                        { name: "1 Hour", value: "3600" },
                        { name: "2 Hours", value: "7200" },
                        { name: "6 Hours", value: "21600" },
                    ],
                },
                {
                    name: "channel",
                    description: "Select a channel to set the slowmode for.",
                    type: ApplicationCommandOptionType.Channel,
                    required: false,
                    channel_types: [ChannelType.GuildText]
                },
                {
                    name: "reason",
                    description: "Give a reason for the slowmode",
                    type: ApplicationCommandOptionType.String,
                    required: false,
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
        const messageRate = interaction.options.getInteger("rate")!;
        const channel = (interaction.options.getChannel("channel") || interaction.channel) as TextChannel;
        const reason = interaction.options.getString("reason") || "No reason provided";
        const silent = interaction.options.getBoolean("silent") || false;

        const errorEmbed = new EmbedBuilder().setColor("Red")

        if(messageRate < 0 || messageRate > 21600)
            return interaction.reply({ embeds: [errorEmbed
                .setDescription("⛔ You can only set the slowmode between 0 and 6 hours!")
            ], flags: MessageFlags.Ephemeral });

        try {
            channel.setRateLimitPerUser(messageRate, reason);
        } catch {
            return interaction.reply({ embeds: [errorEmbed
                .setDescription("⛔ An error occured while tryin to set the slowmode! Please try again later!")
            ], flags: MessageFlags.Ephemeral });
        }

        interaction.reply({ embeds: [new EmbedBuilder()
            .setColor("Green")
            .setDescription(`🕰️ Slowmode set to \`${messageRate}\` seconds!`)
        ], flags: MessageFlags.Ephemeral })

        if(!silent)
            channel?.send({ embeds: [new EmbedBuilder()
                .setColor("Green")
                .setAuthor({ name: `🕰️ Slowmode | ${channel.name}` })
                .setDescription(`**Slowmode** ${messageRate == 0 ? "deactivated" : `\`${messageRate}\` seconds`}`)
                .setTimestamp()
                .setFooter({ text: `Channel ID: ${channel.id}` })
            ]})
            .then(async(msg) => await msg.react("🕰️"));
        
        const guild = await GuildConfig.findOne({ guildId: interaction.guildId })

        if(guild && guild?.logs?.moderation?.enabled && guild?.logs?.moderation?.channelId)
            (await interaction.guild?.channels.fetch(guild.logs.moderation.channelId) as TextChannel)?.send({
                embeds: [new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: `🕰️ Slowmode` })
                    .setDescription(`
                    **Channel:** ${channel}
                    **Slowmode** ${messageRate == 0 ? "deactivated" : `\`${messageRate}\` seconds`}
                    **Reason:** ${reason}
                    `)
                    .setTimestamp()
                    .setFooter({
                        text: `Actioned by ${interaction.user.tag} | ${interaction.user.id}`,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                ]
            })
    }
}