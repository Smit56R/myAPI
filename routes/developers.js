const Developer = require('../models/developer')
const { generateApiKey, hash } = require('../helpers/apiKeyHelper.js')

const express = require('express')
const router = express.Router()


// Middleware
function validateDeveloperBody(req, res, next) {
    const { body: data } = req;

    if (!data.name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    if (!data.email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    if (!data.password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    // if (!data.host) {
    //     return res.status(400).json({ message: 'Host is required' });
    // }

    return next()
}

router.post('/', validateDeveloperBody, postDeveloper)

async function postDeveloper(req, res, next) {
    try {
        const { body: data } = req;
        const { name, email, password, host } = data

        const developers = await Developer.find({ email })

        if (developers.length) {
            throw new Error('The email is already in use')
        }

        const apiKey = generateApiKey()
        const hashedApiKey = hash(apiKey)
        const hashedPassword = hash(password)

        const developer = new Developer({
            name,
            email,
            password: hashedPassword,
            apiKey: hashedApiKey
        })

        await developer.save()

        return res.status(200).json(
            {
                message: 'Success',
                apiKey: apiKey
            }
        )
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
}

module.exports = router