const Guild = require('../models/guild')
const Util = require('../utils/utils.js')

module.exports = {
    name: 'promote',
    description: 'Promote a user into an admin of ListBot',
    usage: '<@user>',
    execute: async (message) => {
        // check if user promoting is admin
        const guildID = message.guild.id
        const authorId = message.author.id

        const guild = await Guild.findOne({ guildID })

        const authorIsAdmin = guild.guildAdminsId.some(
            (adminId) => adminId === authorId
        )

        if (!authorIsAdmin) return
        // get mentioned user
        const mentionedUser = message.mentions.users.first()

        // add id into mongo guild schema
        guild.guildAdminsId.push(mentionedUser.id)
        guild.save()
        let embeddedMessage = Util.embedMessage(
            `Added \`${mentionedUser.tag}\` as an admin`,
            message.author,
            '0xffff00',
            'Hooray!'
        )
        await message.channel.send(embeddedMessage)
    },
}
