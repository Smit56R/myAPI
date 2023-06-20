const express = require('express')
const router = express.Router()
const Subscriber = require('../models/subscriber')
const validateApiKey = require('../middlewares/validateApiKey')

// Get all
router.get('/', validateApiKey, async (_, res) => {
    try {
        const subscribers = await Subscriber.find()
        return res.json(subscribers)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
})

// Get One
router.get('/:id', validateApiKey, getSubscriber, (req, res) => {
    return res.json(res.subscriber)
})

// Create One
router.post('/', validateApiKey, async (req, res) => {
    const subscriber = new Subscriber({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    })
    try {
        const newSub = await subscriber.save()
        return res.status(201).json(newSub)
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
})

// Update One
router.patch('/:id', validateApiKey, getSubscriber, async (req, res) => {
    if (req.body.name != null) {
        res.subscriber.name = req.body.name
    }
    if (req.body.subscribedToChannel != null) {
        res.subscriber.subscribedToChannel = req.body.subscribedToChannel
    }
    try {
        const updatedSub = await res.subscriber.save()
        return res.json(updatedSub)
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
})

// Delete One
router.delete('/:id', validateApiKey, getSubscriber, async (req, res) => {
    try {
        await res.subscriber.deleteOne()
        return res.json({ message: 'Subscriber deleted' })
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
})

async function getSubscriber(req, res, next) {
    let subscriber
    try {
        subscriber = await Subscriber.findById(req.params.id)
        if (subscriber == null) {
            return res.status(404).json({ message: 'Cannot find subscriber ' })
        }
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }

    res.subscriber = subscriber
    return next()
}

module.exports = router