import { ApplicationCommandOptionType, AttachmentBuilder, ChatInputCommandInteraction, EmbedBuilder, GuildMember, MessageFlags, PermissionFlagsBits } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import { Profile } from "discord-arts"

export default class profile extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "profile",
            description: "Get a users profile",
            category: Category.Utilities,
            default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
            options: [
                {
                    name: "target",
                    description: "Select a user",
                    type: ApplicationCommandOptionType.User,
                    required: false
                }
            ],
            cooldown: 3,
            dm_premissions: false,
            dev: false
        });
    }
    async Execute(interaction: ChatInputCommandInteraction) {
        const target = (interaction.options.getMember("target") || interaction.member) as GuildMember;
        await interaction.deferReply({ flags: MessageFlags.Ephemeral })

        const buffer = await Profile(target.id, {
            borderColor: ["#ffffff", "#0000ff", "#ff0000"],
            badgesFrame: true,
            removeAvatarFrame: false,
            presenceStatus: target.presence?.status,
            moreBackgroundBlur: true,
            backgroundBrightness: 100,
            customDate: new Date(),
            disableProfileTheme: false,
            overwriteBadges: true
        });

        const attachment = new AttachmentBuilder(buffer)
            .setName(`${target.user.username}_proifle.png`);

        const colour = (await target.user.fetch()).accentColor;

        interaction.editReply({ /*embeds: [new EmbedBuilder()
            .setColor(colour ?? "Green")
            .setDescription(`Profile for ${target}`)                            // TODO: Fix so the image will be shown inside the embed
            .setImage(`attachment://${target.user.username}_profile.png`)
        ], */files: [attachment] });

    }
}