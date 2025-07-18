import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction, EmbedBuilder, Events, Guild, MessageFlags, PermissionFlagsBits } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class Emit extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "emit",
            description: "Emit an event",
            dev: true,
            default_member_permissions: PermissionFlagsBits.Administrator,
            dm_premissions: false,
            category: Category.Developer,
            cooldown: 1,
            options: [
                {
                    name: "event",
                    description: "The event to emit",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        {name: "GuildCreate", value: Events.GuildCreate},
                        {name: "GuildDelete", value: Events.GuildDelete}
                    ]
                }
            ]
        })
    }

    Execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const event = interaction.options.getString("event");

        if(event == Events.GuildCreate || event == Events.GuildDelete) {
            this.client.emit(event, interaction.guild as Guild);
        }

        interaction.reply({ embeds: [new EmbedBuilder()
            .setColor("Green")
            .setDescription(`Emitted event - \`${event}\``)
        ], flags: MessageFlags.Ephemeral})
    }
}