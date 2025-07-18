import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import ms from "ms";
import os from "os";

const { version , dependencies} = require(`${process.cwd()}/package.json`);

export default class BotInfo extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "botinfo",
            description: "Get the bots info",
            category: Category.Utilities,
            default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
            options: [],
            cooldown: 3,
            dm_premissions: false,
            dev: false
        });
    }
    async Execute(interaction: ChatInputCommandInteraction) {
        interaction.reply({ embeds: [new EmbedBuilder()
            .setThumbnail(this.client.user?.displayAvatarURL()!)
            .setColor("Random")
            .setDescription(`
            __**Bot Info**__
            > **User:** \`${this.client.user?.tag}\` - \`${this.client.user?.id}\`
            > **Account Created:** <t:${(this.client.user!.createdTimestamp / 1000).toFixed(0)}:R>
            > **Commands:** \`${this.client.commands.size}\`
            > **Bot Version:** \`${version}\`
            > **NodeJS Version:** \`${process.version}\`
            > **Dependencies (${Object.keys(dependencies).length}):** \`${Object.keys(dependencies).map((p) => (`${p}-V${dependencies[p]}`).replace(/\^/g, "")).join(", ")}\`
            > **Uptime:** \`${ms(this.client.uptime!, {long: false })}\`

            __**Guild Info**__
            > **Total Guilds:** \`${(await this.client.guilds.fetch()).size}\`

            __**System Info**__
            > **Operating System:** \`${process.platform}\`
            > **CPU:** \`${os.cpus()[0].model.trim()}\`
            > **RAM Usage:** \`${this.formatBytes(process.memoryUsage().heapUsed)}\`/\`${this.formatBytes(os.totalmem())}\`
            
            __**Development Team**__
            > **Creator/Owners:** \`Takkapi\`
            > **Developers:** \`Takkapi\`
            `)
        ], components: [ new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel("Check out my Tg channel!")
                .setStyle(ButtonStyle.Link)
                .setURL("https://t.me/takkpi"),
        )

        ]})
    }

    private formatBytes(bytes: number) {
        if(bytes == 0) return "0";

        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));

        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
    }
}