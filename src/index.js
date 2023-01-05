import {
    Client,
    REST,
    GatewayIntentBits,
    Routes,
    ActionRowBuilder,
    EmbedBuilder
} from "discord.js"
import { config } from "dotenv"
config()
import SendEmbed from "./commands/SendEmbed.js"
import utils from "./utils.js"

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

client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'sendembed') {
            const buttons = new ActionRowBuilder()
                .setComponents(utils.sendButtonPriceHandler())
            await interaction.channel.send({ embeds: [utils.sendEmbedPrices()], components: [buttons] })
        }
    }

    if (interaction.isButton()) {
        if (interaction.component.customId == "SellCoins") {
            await interaction.showModal(utils.sendModalPrices("sell"))
            CoinType = "sell"
        } else if (interaction.component.customId == "BuyCoins") {
            await interaction.showModal(utils.sendModalPrices("buy"))
            CoinType = "buy"
        } else if (interaction.component.customId == "SellAccount") {
            await interaction.showModal(utils.sendModalPrices("account"))
            CoinType = "account"
        } else if (interaction.component.customId == "CloseTicket") {
            await interaction.showModal(utils.transcriptModal())
        }
    }

    if (interaction.isModalSubmit()) {
        if (interaction.customId == "PriceModal") {
            if (interaction.fields.getField("Amount").value.toString().match(/[0-9]+[a-z, A-Z]/)) {
                await interaction.guild.channels.create({
                    name: `${CoinType}-${interaction.fields.getField("PaymentMethod").value}-${interaction.fields.getField("Amount").value}-${interaction.user.tag}`,
                    parent: '1059931083610804334',
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
                    c.send({ components: [Button], embeds: [utils.ticketEmbed()] })
                    interaction.reply({ content: `<@${interaction.user.id}> Successfully made a ticket.\n <#${c.id}>` })
                    setTimeout(() => { interaction.deleteReply() }, 2000)
                })
            } else {
                interaction.reply({ content: `<@${interaction.user.id}> Only numbers are supported. (Example: 100m, or 100,000,000)`})
                setTimeout(() => { interaction.deleteReply() }, 2000)
            }
        }

        if (interaction.customId == "Transcript") {
            const embed = new EmbedBuilder()
                .setAuthor({ name: "[ Icy Coins ]" })
                .setColor(0xf5b942)
                .setTitle("Ticket Closed\nTranscripts")
                .addFields({
                    name: `User: ${interaction.user.tag}`,
                    value: `${interaction.fields.getField("Reason").value}`
                })
                .setFooter({ text: "[ Developed by Butther ]" })
            client.channels.cache.get("1060383555198394429").send({ embeds: [embed] })
            interaction.reply("Closing ticket.")
            setTimeout(() => { interaction.channel.delete("Ticket closed.") }, 5000)
        }
    }
})

async function main() {
    const commands = [
        SendEmbed,
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