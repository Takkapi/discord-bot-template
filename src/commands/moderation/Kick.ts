import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, GuildMember, GuildMemberRoleManager, MessageFlags, PermissionFlagsBits, TextChannel } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class Kick extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "kick",
            description: "Kick a user from the guild",
            category: Category.Moderation,
            default_member_permissions: PermissionFlagsBits.KickMembers,
            dm_premissions: false,
            cooldown: 3,
            dev: false,
            options: [
                {
                    name: "target",
                    description: "Select a user to kick",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: "reason",
                    description: "Provide a reason for the kick",
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: "silent",
                    description: "Don't send a message to the channel",
                    type: ApplicationCommandOptionType.Boolean,
                    required: false,
                }
            ]
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const target = interaction.options.getMember("target") as GuildMember;
        const reason = interaction.options.getString("reason") || "No reason given";
        const silent = interaction.options.getBoolean("silent") || false;

        const errorEmbed = new EmbedBuilder().setColor("Red");

        if(!target)
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(`:x: Please provide a valid user`)
            ], flags: MessageFlags.Ephemeral });

        if(target.id == interaction.user.id)
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(`:x: You cannot kick yourself`)
            ], flags: MessageFlags.Ephemeral });

        if(target.roles.highest.position >= (interaction.member?.roles as GuildMemberRoleManager).highest.position)
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(`:x: You cannot kick a user with equal or higher roles!`)
            ], flags: MessageFlags.Ephemeral });

        if(!target.kickable)
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(`:x: This user cannot be kicked!`)
            ], flags: MessageFlags.Ephemeral });

        if(reason.length > 512)
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(`:x: This reason cannot be longer than 512 characters!`)
            ], flags: MessageFlags.Ephemeral });

        try {
            await target.send({ embeds: [new EmbedBuilder()
                .setColor("Orange")
                .setDescription(`
                👢 You were **kicked** from \`${interaction.guild?.name}\` by ${interaction.member}

                **Reason:** \`${reason}\`
                `)
                .setThumbnail(target.displayAvatarURL({ size: 64 }))
            ]})
        } catch {
            // Do nothing
        }

        try {
            await target.kick(reason);
        } catch {
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(`:x: An error occured while trying to kick this user, please try again later!`)
            ], flags: MessageFlags.Ephemeral })
        }

        interaction.reply({ embeds: [new EmbedBuilder()
            .setColor("Orange")
            .setDescription(`👢 Kicked ${target} - \`${target.id}\``)
        ], flags: MessageFlags.Ephemeral });

        if(!silent) {
            if(interaction.channel && interaction.channel instanceof TextChannel)
                interaction.channel?.send({ embeds: [new EmbedBuilder()
                    .setColor("Orange")
                    .setThumbnail(target.displayAvatarURL({ size: 64 }))
                    .setAuthor({ name: `👢 Kick | ${target.user.tag}` })
                    .setDescription(`
                    **Reason:** \`${reason}\`
                    `)
                    .setTimestamp()
                    .setFooter({ text: `ID: ${target.id}` })
                ]}).then(async(x) => await x.react("👢"));
        }

        const guild = await GuildConfig.findOne({ guildId: interaction.guildId });

        if((guild && guild?.logs?.moderation?.enabled )&& guild?.logs?.moderation?.channelId)
            (await interaction.guild?.channels.fetch(guild.logs.moderation.channelId) as TextChannel)?.send({
                embeds: [new EmbedBuilder()
                    .setColor("Orange")
                    .setThumbnail(target.displayAvatarURL())
                    .setAuthor({ name: `👢 Kick` })
                    .setDescription(`
                    **User:** ${target} - \`${target.id}\`
                    **Reason:** \`${reason}\`
                    `)
                    .setTimestamp()
                    .setFooter({
                        text: `Actioned by ${interaction.user.tag} | ${interaction.user.id}`,
                        iconURL: interaction.user.displayAvatarURL(),
                    })
                ]
            });
    }
}