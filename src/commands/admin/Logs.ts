import { ApplicationCommandOptionType, ChannelType, PermissionFlagsBits } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class Logs extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "logs",
            description: "Configure the logs for your server",
            category: Category.Administrator,
            default_member_permissions: PermissionFlagsBits.Administrator,
            dm_premissions: false,
            dev: false,
            cooldown: 3,
            options: [
                {
                    name: "toggle",
                    description: "Toggle the logs for your server",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "log-type",
                            description: "Type of log to toggle",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            choices: [
                                { name: "Moderation Logs", value: "moderation" }
                            ]
                        },
                        {
                            name: "toggle",
                            description: "Toggle the log",
                            type: ApplicationCommandOptionType.Boolean,
                            required: true
                        }
                    ]
                },
                {
                    name: "set",
                    description: "Set the log channel for your server",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "log-type",
                            description: "Type of log to set",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            choices: [
                                { name: "Moderation Logs", value: "moderation" }
                            ]
                        },
                        {
                            name: "channel",
                            description: "Channel to set the log to",
                            type: ApplicationCommandOptionType.Channel,
                            required: true,
                            channel_types: [ChannelType.GuildText]
                        }
                    ]
                }
            ]
        })
    }
}