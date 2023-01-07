import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const SendVerification = new SlashCommandBuilder()
    .setName("sendverification")
    .setDescription("Send verification reaction message.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .toJSON()

export default SendVerification