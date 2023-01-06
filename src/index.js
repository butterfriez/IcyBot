import {
    Client,
    REST,
    GatewayIntentBits,
    Routes,
    ActionRowBuilder,
    EmbedBuilder,
    Attachment,
    AttachmentBuilder
} from "discord.js"
import { config } from "dotenv"
import newAccount from "./commands/NewAccount.js"
config()
import SendEmbed from "./commands/SendEmbed.js"
import utils from "./utils.js"
import fs from "fs"

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

client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'sendembed') {
            const buttons = new ActionRowBuilder()
                .setComponents(utils.sendButtonPriceHandler())
            await interaction.channel.send({ embeds: [utils.sendEmbedPrices()], components: [buttons] })
        }
        if (interaction.commandName === "account") {
            const ign = interaction.options.getString("username")
            const price = interaction.options.getString("price")
            const rank = interaction.options.getString("rank")
            const networth = interaction.options.getString("networth")
            const slayers = interaction.options.getString("slayers")
            const sa = interaction.options.getInteger("sa")
            const cata = interaction.options.getInteger("cata")

            await interaction.guild.channels.create({
                name: `account-${networth}-${price}`,
                parent: '1060621170514350162',
                permissionOverwrites: [
                    {
                        deny: ['SendMessages'],
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
                    .setTitle("New Account")
                    .setDescription(ign)
                    .setFields(
                        { name: "**[ Info ]**", value: `Rank: ${rank} Networth: ${networth} Skill Average: ${sa}\nCatacombs: ${cata} Slayers: ${slayers}\nBin Price: ${price}` }
                    )
                    .setFooter({ text: "[ Developed by Butther ]" })
                    .setColor(0x34d6d0)

                c.send({ embeds: [embed] })
                interaction.reply(`New account channel created! <#${c.id}>`)
                setTimeout(() => { interaction.deleteReply() }, 2000)
            })
        }
    }

    try {
        if (interaction.isButton()) {
            if (interaction.component.customId == "SellCoins") {
                await interaction.showModal(utils.sendModalPrices("sell"))
                CoinType = "sell"
            }

            if (interaction.component.customId == "BuyCoins") {
                await interaction.showModal(utils.sendModalPrices("buy"))
                CoinType = "buy"
            }

            if (interaction.component.customId == "Account") { //errors idk y
                interaction.showModal(utils.sendModalPrices("account"))
                CoinType = "account"
            }

            if (interaction.component.customId == "CloseTicket") {
                await interaction.showModal(utils.transcriptModal())
            }
        }
    } catch (error) {
        console.error(error)
    }

    if (interaction.isModalSubmit()) {
        if (interaction.customId == "PriceModal") {
            let ChannelId = "1059931083610804334"
            if (CoinType == "buy" || CoinType == "sell") {
                ChannelId = "1059931083610804334"
            } else if (CoinType == "account") {
                ChannelId = "1060620952800604210"
            }

            await interaction.guild.channels.create({
                name: `${CoinType}-${interaction.fields.getField("PaymentMethod").value}-${interaction.fields.getField("Amount").value}-${interaction.user.tag}`,
                parent: ChannelId,
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
            }).then(async c => {
                const Button = new ActionRowBuilder()
                    .setComponents(utils.closeTicketButton())
                if (c.name.includes("buy") || c.name.includes("sell")) {
                    c.send({ components: [Button], embeds: [utils.ticketEmbed()] })
                }
                if (c.name.includes("account")) {
                    c.send({ content: `https://sky.shiiyu.moe/${interaction.fields.getField("Amount").value}`, components: [Button] })
                }
                interaction.reply({ content: `<@${interaction.user.id}> Successfully made a ticket.\n <#${c.id}>` })
                setTimeout(() => { interaction.deleteReply() }, 2000)
            })
        }

        if (interaction.customId == "Transcript") {
            let array = ""
            interaction.channel.messages.cache.forEach(message => {
                array = array + (`${message["author"]["username"]}: ${message["content"]}\n`)
            })
            interaction.reply(`<@${interaction.user.id}> Closing ticket.`)
            setTimeout(() => {
                interaction.channel.delete("Ticket closed.")

                fs.writeFileSync(`../${interaction.channel.id}.txt`, array)
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
                const file = new AttachmentBuilder(fs.createReadStream(`../${interaction.channel.id}.txt`))
                client.channels.cache.get("1060383555198394429").send({ embeds: [embed]})
                interaction.followUp({files: [file]})
            }, 5000)
        }
    }
})

async function main() {
    const commands = [
        SendEmbed,
        newAccount
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