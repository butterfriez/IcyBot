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
        .setName("networth")
        .setDescription("Networth of the account.")
    })
    .addStringOption(option => {
        return option
        .setRequired(true)
        .setName("rank")
        .setDescription("Hypixel rank of the account.")
        .setChoices(
            {name: "Non", value: "Non"},
            {name: "Vip", value: "Vip"},
            {name: "Vip+", value: "Vip+"},
            {name: "Mvp", value: "Mvp"},
            {name: "Mvp+", value: "Mvp+"},
            {name: "Mvp++", value: "Mvp++"}
        )
    })
    .addIntegerOption(option => {
        return option
        .setRequired(true)
        .setName("sa")
        .setDescription("Skill average of the account.")
    })
    .addIntegerOption(option => {
        return option
        .setRequired(true)
        .setName("cata")
        .setDescription("Catacombs level of the account.")
    })
    .addStringOption(option => {
        return option
        .setRequired(true)
        .setName("slayers")
        .setDescription("Slayer levels of the account.")
    })
    .addStringOption(option => {
        return option
        .setRequired(true)
        .setName("price")
        .setDescription("Price of the account.")
    })
    .toJSON()
export default newAccount