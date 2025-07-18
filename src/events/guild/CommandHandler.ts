import { ChatInputCommandInteraction, Collection, EmbedBuilder, Events, MessageFlags } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Events";
import Command from "../../base/classes/Command";

export default class CommandHandler extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.InteractionCreate,
            description: "Commands handler event",
            once: false
        })
    }

    Execute(interaction: ChatInputCommandInteraction) {
        if(!interaction.isChatInputCommand()) return;

        const command: Command = this.client.commands.get(interaction.commandName)!;

        //@ts-ignore
        if(!command) return interaction.reply({ content: "This comamnd does not exist!", flags: MessageFlags.Ephemeral }) && this.client.commands.delete(interaction.commandName);
    
        if(command.dev && !this.client.config.developerUserIds.includes(interaction.user.id))
            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor("Red")
                .setDescription(`:x: This command is only available to developers!`)
        ], flags: MessageFlags.Ephemeral});

        const { cooldowns } = this.client;
        if(!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());

        const now = Date.now();
        const timestamps = cooldowns.get(command.name)!;
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if(timestamps.has(interaction.user.id) && (now < (timestamps.get(interaction.user.id) || 0) + cooldownAmount))
            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor("Red")
                .setDescription(`:x: Please wait another \`${((((timestamps.get(interaction.user.id) || 0) + cooldownAmount) - now) / 1000).toFixed(1)}\` seconds to run this command`)
            ], flags: MessageFlags.Ephemeral})

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        try {
            const subCommandGroup = interaction.options.getSubcommandGroup(false);
            const subCommand = `${interaction.commandName}${subCommandGroup ? `.${subCommandGroup}` : ""}.${interaction.options.getSubcommand(false) || ""}`;

            return this.client.subCommands.get(subCommand)?.Execute(interaction) || command.Execute(interaction);
        } catch(ex) {
            console.log(ex);
        }
    }
}