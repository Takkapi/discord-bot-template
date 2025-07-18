import { ChatInputCommandInteraction, AutocompleteInteraction, CacheType } from "discord.js";
import Category from "../enums/Category";
import ICommand from "../interfaces/ICommand";
import CustomClient from "./CustomClient";
import ICommandsOptions from "../interfaces/ICommandsOptions";

export default class Command implements ICommand {
    client: CustomClient;
    name: string;
    description: string;
    category: Category;
    options: object;
    default_member_permissions: bigint;
    dm_premissions: boolean;
    cooldown: number;
    dev: boolean

    constructor(client: CustomClient, options: ICommandsOptions) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.category = options.category;
        this.options = options.options;
        this.default_member_permissions = options.default_member_permissions;
        this.dm_premissions = options.dm_premissions;
        this.cooldown = options.cooldown;
        this.dev = options.dev;
    }

    Execute(interaction: ChatInputCommandInteraction<CacheType>): void {

    }
    AutoComplete(interaction: AutocompleteInteraction<CacheType>): void {
        
    }
    
}