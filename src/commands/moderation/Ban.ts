import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class Ban extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "ban",
            description: "Ban a user from the guild or remove a ban",
            category: Category.Moderation,
            default_member_permissions: PermissionFlagsBits.BanMembers,
            dm_premissions: false,
            cooldown: 3,
            dev: false,
            options: [
                {
                    name: "add",
                    description: "Ban a user from the guild",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "Select a user to ban",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "Provide a reason for this ban",
                            type: ApplicationCommandOptionType.String,
                            required: false,
                        },
                        {
                            name: "days",
                            description: "Delete the users recent messages",
                            type: ApplicationCommandOptionType.Integer,
                            required: false,
                            choices: [
                                {
                                    name: "None",
                                    value: 0,
                                },
                                {
                                    name: "1 Day",
                                    value: 86400
                                },
                                {
                                    name: "7 Days",
                                    value: 604800,
                                }
                            ]
                        },
                        {
                            name: "silent",
                            description: "Don't send a message to the channel",
                            type: ApplicationCommandOptionType.Boolean,
                            required: false
                        }
                    ]
                },
                {
                    name: "remove",
                    description: "Remove a users ban",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "Enter the users ID",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "Provide a reason for this unban",
                            type: ApplicationCommandOptionType.String,
                            required: false,
                        },
                        {
                            name: "silent",
                            description: "Don't send a message to the channel",
                            type: ApplicationCommandOptionType.Boolean,
                            required: false
                        }
                    ]
                }
            ]
        })
    }
}