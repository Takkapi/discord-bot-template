import { ChatInputCommandInteraction, CacheType, GuildMember, EmbedBuilder, MessageFlags, GuildMemberRoleManager, TextChannel } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class BadAdd extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "ban.add",
        })
    }

    async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const target = interaction.options.getMember("target") as GuildMember;
        const reason = interaction.options.getString("reason") || "No reason was provided";
        const days: number = interaction.options.getInteger("days") || 0;
        const silent = interaction.options.getBoolean("silent") || false;

        const errorEmbed = new EmbedBuilder().setColor("Red")

        if(!target)
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(":x: Please provide a valid user")
        ], flags: MessageFlags.Ephemeral })

        if(target.id == interaction.user.id)
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(":x: You cannot ban yourself lol!")
        ], flags: MessageFlags.Ephemeral })

        if(target.roles.highest.position >= (interaction.member?.roles as GuildMemberRoleManager).highest.position)
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(":x: You cannot ban a user with a higher or equal roles than you!")
        ], flags: MessageFlags.Ephemeral })

        if(!target.bannable)
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(":x: This user cannot be banned!")
        ], flags: MessageFlags.Ephemeral })

        if(reason.length > 512)
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(":x: This reason cannot be longer the 512 characters!")
        ], flags: MessageFlags.Ephemeral })

        try {
            await target.send({ embeds: [new EmbedBuilder()
                .setColor("Red")
                .setDescription(`
                :hammer: You were **banned** from \`${interaction.guild?.name}\` by ${interaction.member}
                If you would like to appeal your ban, send a message to the moderator who banned you.

                **Reason:** \`${reason}\`
                `)
            ]})
        } catch(err) {
            // Do nothing lol
        }

        try {
            await target.ban({ deleteMessageSeconds: days, reason: reason })
        } catch {
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(`:x: An error occured while trying to ban this user, please try again!`)
            ], flags: MessageFlags.Ephemeral })
        }

        interaction.reply({ embeds: [new EmbedBuilder()
            .setColor("Red")
            .setDescription(`🔨 Banned ${target} - \`${target.id}\``)
        ], flags: MessageFlags.Ephemeral })

        if(!silent) {
            if(interaction.channel && interaction.channel instanceof TextChannel)
                interaction.channel?.send({ embeds: [new EmbedBuilder()
                    .setColor("Red")
                    .setThumbnail(target.displayAvatarURL({ size: 64 }))
                    .setAuthor({ name: `🔨 Ban | ${target.user.tag}` })
                    .setDescription(`
                    **Reason:** \`${reason}\`
                    ${days == 0 ? "" : `This users messages in the last \`${(days / 60) / 60}\` hours have been deleted`}
                    `)
                    .setTimestamp()
                    .setFooter({ text: `ID: ${target.id}`})
                ]})
                .then(async(x: any) => await x.react("🔨"))
        }
            

        const guild = await GuildConfig.findOne({ guildId: interaction.guildId })

        if(guild && guild?.logs?.moderation?.enabled && guild?.logs?.moderation?.channelId)
            (await interaction.guild?.channels.fetch(guild.logs.moderation.channelId) as TextChannel).send({ embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setThumbnail(target.displayAvatarURL({ size: 64 }))
                    .setAuthor({ name: "🔨 Ban" })
                    .setDescription(`
                    **User:** ${target} - \`${target.id}\`
                    **Reason:** \`${reason}\`
                    ${days == 0 ? "" : `This users messages in the last \`${(days / 60) / 60}\` hours have been deleted`}
                    `)
                    .setTimestamp()
                    .setFooter({
                        text: `Actioned by ${interaction.user.tag} | ${interaction.user.id}`,
                        iconURL: interaction.user.displayAvatarURL({}),
                    })
            ]});
    }
}