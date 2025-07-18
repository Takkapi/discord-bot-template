import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class Timeout extends Command {
    constructor(client: CustomClient) {
        super(client,  {
            name: "timeout",
            description: "Timeout a user",
            category: Category.Moderation,
            default_member_permissions: PermissionFlagsBits.MuteMembers,
            options: [
                {
                    name: "add",
                    description: "Add a timeout to a user",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "Select a member to timeout",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "length",
                            description: "Length of the timeout",
                            type: ApplicationCommandOptionType.String,
                            required: false,
                            choices: [
                                { name: "5 Minutes", value: "5m" },
                                { name: "10 Minutes", value: "10m" },
                                { name: "15 Minutes", value: "15m" },
                                { name: "30 Minutes", value: "30m" },
                                { name: "35 Minutes", value: "35m" },
                                { name: "1 Hour", value: "1h" },
                                { name: "2 Hours", value: "2h" },
                                { name: "6 Hours", value: "6h" },
                                { name: "12 Hours", value: "12h" },
                                { name: "1 Day", value: "1d" },
                                { name: "3 Days", value: "3d" },
                                { name: "5 Days", value: "5d" },
                                { name: "1 Week", value: "1w" },
                                { name: "2 Weeks", value: "2w" },
                                { name: "3 Weeks", value: "3w" },
                                { name: "4 Weeks", value: "4w" }
                            ]
                        },
                        {
                            name: "reason",
                            description: "Provide a reason for the timeout",
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
                },
                {
                    name: "remove",
                    description: "Remove a timeout from a user",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "Select a member to remove the timeout from",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "Provide a reason for the removal of the timeout",
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
                }
            ],
            dev: false,
            dm_premissions: false,
            cooldown: 3
        })
    }
}