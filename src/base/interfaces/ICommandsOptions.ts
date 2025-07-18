import Category from "../enums/Category";

export default interface ICommandsOptions {
    name: string;
    description: string,
    category: Category;
    options: object;
    default_member_permissions: bigint;
    dm_premissions: boolean;
    cooldown: number;
    dev: boolean;
}