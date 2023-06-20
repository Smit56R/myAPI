require('dotenv').config()
const Developer = require('../models/developer')
const { hash } = require('../helpers/apiKeyHelper.js')

const handleDeveloperUsage = async (developer) => {
    const updatedDeveloper = developer
    const isNewDay = !(updatedDeveloper.usage.date == new Date())
    updatedDeveloper.usage.date = Date.now()

    if (isNewDay) {
        updatedDeveloper.usage.count = 0
    } else {
        updatedDeveloper.usage.count += 1
    }

    return updatedDeveloper.save()
}

const findDeveloper = async ({ apiKey }) => {
    const hashedApiKey = hash(apiKey)
    return await Developer.findOne({ apiKey: hashedApiKey })
}

async function validateApiKey(req, res, next) {
    try {
        let apiKey = req.headers['X-API-Key'] || req.headers['x-api-key']
        // let host = req.headers.Origin || req.headers.origin

        if (apiKey === process.env.MAIN_KEY) {
            return next()
        }

        if (!apiKey) {
            throw new Error(`X-API-Key Header doesn't exist`)
        }
        // if(!host) {
        //     throw new Error(`Origin Header doesn't exist`)
        // }

        const developer = await findDeveloper({ apiKey })

        if (developer) {
            if (developer.usage.count >= 2500) {
                return res.status(403).json({ message: 'You have exceeded your limit of requests per day' })
            }
            await handleDeveloperUsage(developer)
            return next()
        }

        return res.status(401).json({ message: 'Your API key is invalid' })
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
}

module.exports = validateApiKey