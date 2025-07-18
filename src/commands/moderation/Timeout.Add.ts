import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, GuildMemberRoleManager, MessageFlags, TextChannel } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import ms, { StringValue } from "ms";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class TimeoutAdd extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "timeout.add"
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const target = interaction.options.getMember("target") as GuildMember;
        const length = interaction.options.getString("length") || '5m';
        const reason = interaction.options.getString("reason") || "No reason provided";
        const silent = interaction.options.getBoolean("silent") || false;
        const msLength = ms(length as StringValue);
        

        const errorEmbed = new EmbedBuilder().setColor("Red");

        if(!target)
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(`:x: Please provide a valid user`)
            ], flags: MessageFlags.Ephemeral })

        if(target.id == interaction.user.id)
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(`:x: You cannot timeout yourself.`)
            ], flags: MessageFlags.Ephemeral })
        
        if(target.roles.highest.position >= (interaction.member?.roles as GuildMemberRoleManager).highest.position)
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(`:x: You cannot timeout a user with equal or higher roles!`)
            ], flags: MessageFlags.Ephemeral })

        if(target.communicationDisabledUntil != null && target.communicationDisabledUntil > new Date())
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(`:x: ${target} is already timed out until \`${target.communicationDisabledUntil.toLocaleString()}\``)
            ], flags: MessageFlags.Ephemeral })

        if(reason.length > 512) 
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(`:x: Reason cannot exceed 512 characters!`)
            ], flags: MessageFlags.Ephemeral })

        try {
            await target.send({ embeds: [new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`
                ⏲️ You have been **timed out** in \`${interaction.guild?.name}\` for \`${length}\`
                If you believe this was a mistake, contact a moderator.

                **Reason:** \`${reason}\`
                `)
                .setImage(interaction.guild?.iconURL()!)
            ]})
        } catch {
            // Do nothing
        }

        try {
            await target.timeout(msLength, reason);
        } catch {
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(`:x: An error occured while trying to timeout this user, please try again later!`)
            ], flags: MessageFlags.Ephemeral })
        }

        interaction.reply({ embeds: [new EmbedBuilder()
            .setColor("Blue")
            .setDescription(`⏲️ Timed out ${target} - \`${target.id}\` from \`${length}\``)
        ], flags: MessageFlags.Ephemeral });

        if(!silent) {
            if(interaction.channel && interaction.channel instanceof TextChannel)
                interaction.channel?.send({ embeds: [new EmbedBuilder()
                    .setColor("Blue")
                    .setThumbnail(target.displayAvatarURL({ size: 64 }))
                    .setAuthor({ name: `⏲️ Timeout | ${target.user.tag}` })
                    .setDescription(`
                    **Reason:** \`${reason}\`
                    **Expires:** <t:${((Date.now() + msLength) / 1000).toFixed(0)}:F>
                    `)
                    .setTimestamp()
                    .setFooter({ text: `ID: ${target.id}`})
                ]})
                .then(async(x: any) => await x.react("⏲️"))
        }
            

        const guild = await GuildConfig.findOne({ guildId: interaction.guildId })

        if(guild && guild?.logs?.moderation?.enabled && guild?.logs?.moderation?.channelId)
            (await interaction.guild?.channels.fetch(guild.logs.moderation.channelId) as TextChannel).send({ embeds: [
                new EmbedBuilder()
                    .setColor("Blue")
                    .setThumbnail(target.displayAvatarURL({ size: 64 }))
                    .setAuthor({ name: "⏲️ Timeout" })
                    .setDescription(`
                    **User:** ${target} - \`${target.id}\`
                    **Reason:** \`${reason}\`
                    **Expires:** <t:${((Date.now() + msLength) / 1000).toFixed(0)}:F>
                    `)
                    .setTimestamp()
                    .setFooter({
                        text: `Actioned by ${interaction.user.tag} | ${interaction.user.id}`,
                        iconURL: interaction.user.displayAvatarURL({}),
                    })
            ]});
    }
}