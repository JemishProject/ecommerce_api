const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { generateToken } = require('../services/token')
const { validate } = require('../middleware/auth')

router.post('/register', async (req, res) => {
    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json('That user already exisits!');
    } else {
        // Insert the new user if they do not exist yet
        user = new User({
            mobile: req.body.mobile,
            email: req.body.email,
            password: req.body.password
        });
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        await user.save()
        return res.status(200).send({ 
            status: true,
            message: 'Registered Successfully.'
        });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    const userValid = await User.findOne({ email })

    if(!userValid) {
        return res.send({ error: 'User Not Exist.'})
    }

    const passwordValid = await bcrypt.compare(password, userValid.password)

    if(!passwordValid) {
        return res.send({ error: 'Invalid Password.'})
    }
    
    const payload = { email: email }
    const token = generateToken(payload)

    return res.status(200).send({
        status: true,
        message: 'Log in Successfully.',
        token
    })
});

router.get('/loggedin', validate, async (req, res) => {
    const { email } = req.decoded
    
    const userValid = await User.findOne({ email })
    // const rea = res.authorizationHeader
    return res.status(200).send({
        status: true,
        message: 'Logged in Successfully.',
        userValid
    })
})

module.exports = router;