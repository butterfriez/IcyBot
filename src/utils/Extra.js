import axios from "axios"
import utils from "./utils.js"
import { EmbedBuilder } from "discord.js"
import fs from "fs/promises"
export default {
    accountUtil: (interaction) => {
        axios.request(`http://localhost:3000/v1/profiles/${interaction.options.getString("username")}?key=real`).then(async d => {
            const currentProfile = d.data.data.find(datum => datum.selected)
            const data = await fs.readFile("data.json")
            const [rank, networth, bank, purse, cata, price, ign, sa, slayers] = [
                currentProfile["rank"].toString().replace(/(?:(&|§)(.?))/g, ""),
                currentProfile["networth"]["networth"].toString(),
                utils.abbreviateNumber(currentProfile["networth"]["bank"].toString()),
                utils.abbreviateNumber(currentProfile["networth"]["purse"].toString()),
                currentProfile["dungeons"]["catacombs"]["skill"]["level"],
                utils.abbreviateNumber(interaction.options.getString("price")),
                interaction.options.getString("username"),
                utils.abbreviateNumber((currentProfile["skills"]["alchemy"]["level"] + currentProfile["skills"]["mining"]["level"] + currentProfile["skills"]["enchanting"]["level"] + currentProfile["skills"]["combat"]["level"] + currentProfile["skills"]["carpentry"]["level"] + currentProfile["skills"]["farming"]["level"] + currentProfile["skills"]["fishing"]["level"] + currentProfile["skills"]["foraging"]["level"] + currentProfile["skills"]["taming"]["level"]) / 10),
                `${currentProfile["slayer"]["zombie"]["level"]}/${currentProfile["slayer"]["spider"]["level"]}/${currentProfile["slayer"]["wolf"]["level"]}/${currentProfile["slayer"]["enderman"]["level"]}/${currentProfile["slayer"]["blaze"]["level"]}`
            ]
            const obj = JSON.parse(data)
            utils.saveData("accounts", null, true)

            interaction.guild.channels.create({
                name: `account-${obj["accounts"] + 1}-${utils.abbreviateNumber(networth, true)}-${price}`,
                parent: '1060621170514350162',
                permissionOverwrites: [
                    {
                        deny: ['SendMessages'],
                        id: '1059911439583825940',
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
                        { name: "**[ Info ]**", value: `Rank: ${rank}\nNetworth: ${utils.abbreviateNumber(networth)}\nBank: ${bank}\nPurse: ${purse}\nSkill Average: ${sa}\nCatacombs: ${cata}\nSlayers: ${slayers}\n**Bin Price: ${price}**` }
                    )
                    .setFooter({ text: "[ Developed by Butther ]" })
                    .setColor(0x34d6d0)
                    .setThumbnail(`https://mc-heads.net/avatar/${interaction.options.getString("username")}`)

                c.send({ embeds: [embed] })
            })
        }).catch(error => {
            interaction.reply("Error occured! (Might be rate-limit reached)")
            setTimeout(() => {
                interaction.deleteReply()
            }, 2000)
            console.error(error)
        })
    },

    accountTicketUtil: (username, interaction, CoinType, channelId) => {
        axios.request(`http://localhost:3000/v1/profiles/${username}?key=real`).then(async d => {
            const currentProfile = d.data.data.find(datum => datum.selected)
            const [rank, networth, bank, purse, cata, ign, sa, slayers] = [
                currentProfile["rank"].toString().replace(/(?:(&|§)(.?))/g, ""),
                currentProfile["networth"]["networth"].toString(),
                utils.abbreviateNumber(currentProfile["networth"]["bank"].toString()),
                utils.abbreviateNumber(currentProfile["networth"]["purse"].toString()),
                currentProfile["dungeons"]["catacombs"]["skill"]["level"],
                username,
                utils.abbreviateNumber((currentProfile["skills"]["alchemy"]["level"] + currentProfile["skills"]["mining"]["level"] + currentProfile["skills"]["enchanting"]["level"] + currentProfile["skills"]["combat"]["level"] + currentProfile["skills"]["carpentry"]["level"] + currentProfile["skills"]["farming"]["level"] + currentProfile["skills"]["fishing"]["level"] + currentProfile["skills"]["foraging"]["level"] + currentProfile["skills"]["taming"]["level"]) / 10),
                `${currentProfile["slayer"]["zombie"]["level"]}/${currentProfile["slayer"]["spider"]["level"]}/${currentProfile["slayer"]["wolf"]["level"]}/${currentProfile["slayer"]["enderman"]["level"]}/${currentProfile["slayer"]["blaze"]["level"]}`
            ]

            interaction.guild.channels.create({
                name: `${CoinType}-${interaction.fields.getField("PaymentMethod").value}-${interaction.fields.getField("Amount").value}-${interaction.user.tag}`,
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
                    .setTitle("New Account")
                    .setDescription(ign)
                    .setFields(
                        { name: "**[ Info ]**", value: `Rank: ${rank}\nNetworth: ${utils.abbreviateNumber(networth)}\nBank: ${bank}\nPurse: ${purse}\nSkill Average: ${sa}\nCatacombs: ${cata}\nSlayers: ${slayers}` }
                    )
                    .setFooter({ text: "[ Developed by Butther ]" })
                    .setColor(0x34d6d0)
                    .setThumbnail(`https://mc-heads.net/avatar/${interaction.options.getString("username")}`)

                c.send({ embeds: [embed], components: [new ActionRowBuilder().setComponents(utils.closeTicketButton())] })
            })
        }).catch(error => {
            interaction.reply("Error occured! (Might be rate-limit reached)")
            setTimeout(() => {
                interaction.deleteReply()
            }, 2000)
            console.error(error)
        })
    }
}