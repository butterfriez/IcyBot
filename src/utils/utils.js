import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js"
import fs from "fs/promises"
export default {
    sendEmbedPrices: () => {
        let msg = new EmbedBuilder()
            .setAuthor({ name: "[ Icy Coins ]" })
            .setTitle("Click on one of the buttons below\nto get started!")
            .addFields({
                "name": "[ Prices ]",
                "value": "**-------------\nSELLING Prices we buy at.\n-------------**\n[ 200m - 1b ] **0.06/m**\n[ 1b+ ] **0.07/m**\n\n**-------------\nBUYING Prices we sell at.\n-------------**\n[ 200m - 1b ] **0.11/m**\n[ 1b+ ] **0.1/m**"
            })
            .setColor(0x34d6d0)
            .setFooter({ text: "[ Developed by Butther ]" })

        return msg;
    },

    sendVerification: () => {
        let msg = new EmbedBuilder()
            .setAuthor({ name: "[ Icy Coins ]" })
            .setTitle("**Click on the button below to get verified.**")
            .setColor(0x34d6d0)
            .setFooter({ text: "[ Developed by Butther ]" })

        return msg;
    },

    sendModalPrices: (option) => {
        const modal = new ModalBuilder()
            .setCustomId("PriceModal")
            .setTitle("Create New Ticket")

        const paymentMethod = new ActionRowBuilder()
            .setComponents(
                new TextInputBuilder()
                    .setLabel("Payment Method")
                    .setCustomId("PaymentMethod")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("Input payment method you want here! (Check #prices for payment methods.)")
            )

        const sellCoins = new ActionRowBuilder()
            .setComponents(
                new TextInputBuilder()
                    .setLabel("Amount of Coins")
                    .setCustomId("Amount")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("Amount of coins you want to sell.")
            )

        const buyCoins = new ActionRowBuilder()
            .setComponents(
                new TextInputBuilder()
                    .setLabel("Amount of Coins")
                    .setCustomId("Amount")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("Amount of coins you want to buy.")
            )
        
        const sellAccount = new ActionRowBuilder()
                .setComponents(
                    new TextInputBuilder()
                        .setLabel("Username")
                        .setCustomId("Amount")
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder("Username of the account.")
                )

        if (option == "sell") {
            return modal.setComponents(paymentMethod, sellCoins)
        } else if (option == "buy") {
            return modal.setComponents(paymentMethod, buyCoins)
        } else if (option == "account") {
            return modal.setComponents(paymentMethod, sellAccount)
        }
    },

    sendButtonPriceHandler: () => {
        const button = new ButtonBuilder()
            .setCustomId("SellCoins")
            .setLabel("Sell Coins")
            .setStyle(ButtonStyle.Primary)

        const button1 = new ButtonBuilder()
            .setCustomId("BuyCoins")
            .setLabel("Buy Coins")
            .setStyle(ButtonStyle.Primary)

        const button2 = new ButtonBuilder()
            .setCustomId("Account")
            .setLabel("Sell/Buy Account")
            .setStyle(ButtonStyle.Primary)

        return [button, button1, button2]
    },

    closeTicketButton: () => {
        const button = new ButtonBuilder()
            .setCustomId("CloseTicket")
            .setLabel("Close Ticket")
            .setStyle(ButtonStyle.Danger)

        return [button]
    },

    transcriptModal: () => {
        const modal = new ModalBuilder()
            .setTitle("Transcript")
            .setCustomId("Transcript")
            
        const reason = new ActionRowBuilder()
            .setComponents(
                new TextInputBuilder()
                    .setCustomId("Reason")
                    .setLabel("Reason For Closing.")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("Input reason here.")
            )
        
        return modal.setComponents(reason)
    },

    ticketEmbed: () => {
        let msg = new EmbedBuilder()
            .setAuthor({ name: "[ Icy Coins ]" })
            .setTitle("Info!")
            .addFields({
                "name": "[ What to Do ]",
                "value": "Please state the **IGN** of your account."
            })
            .setColor(0x34d6d0)
            .setFooter({ text: "[ Developed by Butther ]" })

        return msg;
    },
    
    //chatgpt
    abbreviateNumber: (num) => {
        return new Intl.NumberFormat("en-US", {notation: "compact",compactDisplay: "short"}).format(num)
    },

    saveData: async(key, value, num) => {
        const data = await fs.readFile('data.json');
        const obj = JSON.parse(data);
        
        if(num) {
            obj[key]++
        } else {
            obj[key] = value
        }

        await fs.writeFile('data.json', JSON.stringify(obj));
    }
}
