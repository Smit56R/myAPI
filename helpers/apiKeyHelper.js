require('dotenv').config()
const crypto = require('crypto')

const uuid = require('uuid').v4

const generateApiKey = uuid
// 415f1e8c-7309-4b40-8e43-e11e9a90298a

const hash = (value) => {
    const algorithm = 'sha512'
    const secret = process.env.DEVELOPER_SECRET || 'developer_secret'
    return crypto.createHmac(algorithm, secret).update(value).digest('hex')
}

module.exports = {
    generateApiKey: generateApiKey,
    hash: hash
}