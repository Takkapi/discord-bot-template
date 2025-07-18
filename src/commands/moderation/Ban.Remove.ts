import { ChatInputCommandInteraction, CacheType, GuildMember, EmbedBuilder, MessageFlags, GuildMemberRoleManager, TextChannel } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class BadRemove extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "ban.remove",
        })
    }

    async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const target = interaction.options.getString("target");
        const reason = interaction.options.getString("reason") || "No reason was provided";
        const silent = interaction.options.getBoolean("silent") || false;

        const errorEmbed = new EmbedBuilder().setColor("Red")

        if(reason.length > 512)
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(":x: This reason cannot be longer the 512 characters!")
        ], flags: MessageFlags.Ephemeral })

        try {
            await interaction.guild?.bans.fetch(target!);
        } catch {
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(`:x: This user is not banned!`)
            ], flags: MessageFlags.Ephemeral })
        }

        try {
            await interaction.guild?.bans.remove(target!, reason);
        } catch {
            return interaction.reply({ embeds: [errorEmbed
                .setDescription(`:x: An error occured while trying to unban this user, please try again!`)
            ], flags: MessageFlags.Ephemeral })
        }

        interaction.reply({ embeds: [new EmbedBuilder()
            .setColor("Green")
            .setDescription(`🔨 Unbanned ${target}`)
        ], flags: MessageFlags.Ephemeral })

        if(!silent) {
            if(interaction.channel && interaction.channel instanceof TextChannel)
            interaction.channel?.send({ embeds: [new EmbedBuilder()
                .setColor("Green")
                .setAuthor({ name: `🔨 Unban | ${target}` })
                .setDescription(`
                **Reason:** \`${reason}\`
                `)
                .setTimestamp()
            ]})
            .then(async(x: any) => await x.react("✅"))
        }

        const guild = await GuildConfig.findOne({ guildId: interaction.guildId })

        if(guild && guild?.logs?.moderation?.enabled && guild?.logs.moderation.channelId)
            (await interaction.guild?.channels.fetch(guild.logs.moderation.channelId) as TextChannel).send({ embeds: [
                new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: "🔨 Unban" })
                    .setDescription(`
                    **User:** ${target}
                    **Reason:** \`${reason}\`
                    `)
                    .setTimestamp()
                    .setFooter({
                        text: `Actioned by ${interaction.user.tag} | ${interaction.user.id}`,
                        iconURL: interaction.user.displayAvatarURL({}),
                    })
            ]});
    }
}