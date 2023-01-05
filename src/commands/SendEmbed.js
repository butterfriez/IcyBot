import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const SendEmbed = new SlashCommandBuilder()
    .setName("sendembed")
    .setDescription("Send price info message.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .toJSON()

export default SendEmbed