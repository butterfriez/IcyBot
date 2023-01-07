import axios from "axios"
import utils from "./utils.js"
import { EmbedBuilder } from "discord.js"
export default {
    accountUtil: (interaction) => {
        axios.request(`http://localhost:3000/v1/profiles/${interaction.options.getString("username")}?key=real`).then(d => {
            const currentProfile = d.data.data.find(datum => datum.selected)
            const [rank, networth, bank, purse, cata, price, ign, sa, slayers] = [
                currentProfile["rank"].toString().replace(/(?:(&|§)(.?))/g, ""),
                currentProfile["networth"]["networth"].toString(),
                utils.abbreviateNumber(currentProfile["networth"]["bank"].toString()),
                utils.abbreviateNumber(currentProfile["networth"]["purse"].toString()),
                currentProfile["dungeons"]["catacombs"]["skill"]["level"],
                utils.abbreviateNumber(interaction.options.getString("price"), true),
                interaction.options.getString("username"),
                utils.abbreviateNumber((currentProfile["skills"]["alchemy"]["level"] + currentProfile["skills"]["mining"]["level"] + currentProfile["skills"]["enchanting"]["level"] + currentProfile["skills"]["combat"]["level"] + currentProfile["skills"]["carpentry"]["level"] + currentProfile["skills"]["farming"]["level"] + currentProfile["skills"]["fishing"]["level"] + currentProfile["skills"]["foraging"]["level"] + currentProfile["skills"]["taming"]["level"]) / 10),
                `${currentProfile["slayer"]["zombie"]["level"]}/${currentProfile["slayer"]["spider"]["level"]}/${currentProfile["slayer"]["wolf"]["level"]}/${currentProfile["slayer"]["enderman"]["level"]}/${currentProfile["slayer"]["blaze"]["level"]}`
            ]
            interaction.guild.channels.create({
                name: `account-${utils.abbreviateNumber(networth, true)}-${price}`,
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

                c.send({ embeds: [embed] })
                interaction.reply(`New account channel created! <#${c.id}>`)
                setTimeout(() => { interaction.deleteReply() }, 2000)
            })
        }).catch(error => {
            interaction.reply("Error occured! (Might be rate-limit reached)")
            setTimeout(() => {
                interaction.deleteReply()
            }, 3000)
            console.error(error)
        })
    }
}