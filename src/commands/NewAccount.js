import { SlashCommandBuilder } from "discord.js";

let newAccount = new SlashCommandBuilder()
    .setName("account")
    .setDescription("New account channel.")
    .addStringOption(option => {
        return option
        .setRequired(true)
        .setName("username")
        .setDescription("Username of the account.")
    })
    .addStringOption(option => {
        return option
        .setRequired(true)
        .setName("price")
        .setDescription("Price of the account.")
    })
    .toJSON()
export default newAccount