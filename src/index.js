import {
    Client,
    REST,
    GatewayIntentBits,
    Routes,
    ActionRowBuilder,
    EmbedBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle
} from "discord.js"
import { config } from "dotenv"
import newAccount from "./commands/NewAccount.js"
import SendEmbed from "./commands/SendEmbed.js"
import SendVerification from "./commands/SendVerification.js"
config()
import utils from "./utils/utils.js"
import fs from "fs/promises"
import Extra from "./utils/Extra.js"

const token = process.env.TOKEN
const client_id = process.env.CLIENT_ID
const guild_id = "1059911439583825940"
const client = new Client(
    {
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages]
    }
)
let CoinType;
const rest = new REST({ version: '10' }).setToken(token)

client.on('ready', () => console.log(`Icy Bot launched! ${client.user.tag}`))

client.on("guildMemberAdd", (member) => {
    client.guilds.client.channels.cache.get("1060665184768766033").edit({})
})

client.on('interactionCreate', (interaction) => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'sendembed') {
            const buttons = new ActionRowBuilder()
                .setComponents(utils.sendButtonPriceHandler())
            interaction.channel.send({ embeds: [utils.sendEmbedPrices()], components: [buttons] })
        }
        if (interaction.commandName === "account") {
            Extra.accountUtil(interaction)
        }
        if(interaction.commandName === "sendverification") {
            const buttons = new ActionRowBuilder()
                .setComponents(
                    new ButtonBuilder()
                        .setCustomId("Verify")
                        .setStyle(ButtonStyle.Success)
                        .setLabel("Verify")
                )
            interaction.channel.send({ embeds: [utils.sendVerification()], components: [buttons]})
        }
    }

    try {
        if (interaction.isButton()) {
            if (interaction.component.customId == "SellCoins") {
                interaction.showModal(utils.sendModalPrices("sell"))
                CoinType = "sell"
            }

            if (interaction.component.customId == "BuyCoins") {
                interaction.showModal(utils.sendModalPrices("buy"))
                CoinType = "buy"
            }

            if (interaction.component.customId == "Account") { //errors idk y
                interaction.showModal(utils.sendModalPrices("account"))
                CoinType = "account"
            }

            if (interaction.component.customId == "CloseTicket") {
                interaction.showModal(utils.transcriptModal())
            }

            if (interaction.component.customId == "Verify") {
                interaction.member.roles.add(interaction.guild.roles.cache.find(role => role.name.toLowerCase() == "verified"))
                interaction.member.roles.remove(interaction.guild.roles.cache.find(role => role.name.toLowerCase() == "unverified"))
                interaction.reply(`Verified <@${interaction.user.id}>!`)
                setTimeout(() => {interaction.deleteReply()}, 2000)
            }
        }
    } catch (error) {
        console.error(error)
    }

    if (interaction.isModalSubmit()) {
        if (interaction.customId == "PriceModal") {
            let channelId = "1059931083610804334"
            let amount = interaction.fields.getField("Amount").value
            if(amount.match(/(\d*\.?)/g)) {
                amount = utils.abbreviateNumber(amount)
            }

            if (CoinType == "buy" || CoinType == "sell") {
                channelId = "1059931083610804334"
                interaction.guild.channels.create({
                    name: `${CoinType}-${interaction.fields.getField("PaymentMethod").value}-${amount.replace(".", "point")}-${interaction.user.tag}`,
                    parent: channelId,
                    permissionOverwrites: [
                        {
                            allow: ['ViewChannel', 'SendMessages'],
                            id: interaction.user.id,
                        },
                        {
                            allow: ['ViewChannel', 'SendMessages'],
                            id: client.user.id
                        },
                        {
                            deny: ['ViewChannel', 'SendMessages'],
                            id: guild_id,
                        },
                        {
                            allow: ['ViewChannel', 'SendMessages'],
                            id: '1060399996677144627'
                        }
                    ]
                }).then(c => {

                    const embed = new EmbedBuilder()
                        .setAuthor({ name: "[ Icy Accounts ]" })
                        .setTitle(`New **${CoinType.toString().toUpperCase()}** Ticket!`)
                        .setFields(
                            { name: "**[ Info ]**", value: `Amount: ${amount}\nPayment Method: ${interaction.fields.getField("PaymentMethod").value}` }
                        )
                        .setFooter({ text: "[ Developed by Butther ]" })
                        .setColor(0x34d6d0)
    
                    c.send({ embeds: [embed], components: [new ActionRowBuilder().setComponents(utils.closeTicketButton())] })
                    interaction.reply(`<@${interaction.user.id}> New ticket created! <#${c.id}>`)
                    setTimeout(() => {interaction.deleteReply()}, 3000)
                })
            } else if (CoinType == "account") {
                channelId = "1060620952800604210"
                Extra.accountTicketUtil(interaction.fields.getField("Amount"), interaction, CoinType, channelId)
            }
        }

        if (interaction.customId == "Transcript") {
            let array = ""
            interaction.channel.messages.cache.forEach(message => {
                array = array + (`${message["author"]["username"]}: ${message["content"]}\n`)
            })
            interaction.reply(`<@${interaction.user.id}> Closing ticket.`)
            setTimeout(() => {
                interaction.channel.delete("Ticket closed.")

                fs.writeFileSync(`./txt//${interaction.channel.id}.txt`, array)
                const embed = new EmbedBuilder()
                    .setAuthor({ name: "[ Icy Coins ]" })
                    .setColor(0xf5b942)
                    .setTitle("Ticket Closed\nTranscripts")
                    .addFields(
                        {
                            name: `User: ${interaction.user.tag}`,
                            value: `${interaction.fields.getField("Reason").value}`
                        })
                    .setFooter({ text: "[ Developed by Butther ]" })
                const file = new AttachmentBuilder(fs.createReadStream(`./txt/${interaction.channel.id}.txt`))
                client.channels.cache.get("1060383555198394429").send({ embeds: [embed] })
                interaction.followUp({ files: [file] })
            }, 5000)
        }
    }
})

client.on("error", (error) => {
    console.error(error)
})
async function main() {
    const commands = [
        SendEmbed,
        newAccount,
        SendVerification
    ]
    try {
        console.log('Started refreshing (/) commands')
        await rest.put(Routes.applicationGuildCommands(client_id, guild_id),
            {
                body: commands,
            })
        client.login(token)
    } catch (error) {
        console.error(error);
    }
}

main()