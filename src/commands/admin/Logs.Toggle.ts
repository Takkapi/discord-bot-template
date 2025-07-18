import { ChatInputCommandInteraction, CacheType, TextChannel, MessageFlags, EmbedBuilder } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class LogsToggle extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "logs.toggle",
        })
    }

    async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const logType = interaction.options.getString("log-type");
        const enabled = interaction.options.getBoolean("toggle");

        await interaction.deferReply( { flags: MessageFlags.Ephemeral });

        try {
            let guild = await GuildConfig.findOne({ guildId: interaction.guildId })

            if(!guild)
                guild = await GuildConfig.create({ guildId: interaction.guildId })
        
            //@ts-ignore
            guild.logs[`${logType}`].enabled = enabled;

            await guild.save();

            return interaction.editReply({ embeds: [new EmbedBuilder()
                .setColor("Green")
                .setDescription(`:white_check_mark: ${enabled ? "Enabled" : "Disabled"} \`${logType}\` logs!`)
            ]});
        } catch(err) {
            console.error(err);
            return interaction.editReply({ embeds: [new EmbedBuilder()
                .setColor("Red")
                .setDescription(":x: There was an error while update the database, please try again later!")
            ]});
        }
    }
}