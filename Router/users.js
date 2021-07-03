const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { generateToken } = require('../services/token')
const { validate } = require('../middleware/auth')
const multer  = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images');
    },
    filename: (req, file, cb) => {
      console.log(file);
      var filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
var upload = multer({storage: storage});


router.post('/register', async (req, res) => {
    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({
            status: false,
            message: 'That user already exisits!'
        });
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
        return res.send({ 
            status: false,
            message: 'User Not Exist.'
        })
    }

    const passwordValid = await bcrypt.compare(password, userValid.password)

    if(!passwordValid) {
        return res.send({ 
            status: false,
            message: 'Invalid Password.'
        })
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
    
    return res.status(200).send({
        status: true,
        message: 'Logged in Successfully.',
        userValid
    })
})

router.get('/', async (req, res) => {
    return res.status(200).send({
        status: true,
        message: "Hello",
    })
})

router.put('/changepassword/:email', async (req, res) => {
    const {email} = req.params
    const {oldPassword, newPassword} = req.body

    const userValid = await User.findOne({ email })

    if(!userValid) {
        return res.send({ 
            status: false,
            message: 'User does not exist.'
        })
    }

    const passwordValid = await bcrypt.compare(oldPassword, userValid.password)

    if(!passwordValid) {
        return res.send({ 
            status: false,
            message: 'Invalid Password.'
        })
    }
    const salt = await bcrypt.genSalt(10)
    userValid.password = await bcrypt.hash(newPassword, salt)
    const changedPassword = await userValid.save()
    return res.status(200).send({
        status: true,
        message: "Changed password successfullt.",
        changedPassword
    })
})

router.post('/profile', validate, upload.single('image'), async (req, res, next) => {
    const { email } = req.decoded
    const image = req.file
    const { firstname, lastname, address } = req.body

    const userValid = await User.findOne({email})
    if(!userValid) {
        return res.status(401).send({
            status: false,
            message: "Something went wrong"
        })
    }
    if(!image) {
        return res.status(500).send({
            status: false,
            message: "Please select a profile image."
        })
    }

    userValid.firstname = firstname
    userValid.lastname = lastname
    userValid.address = address
    userValid.image = process.env.NODE_IMAGE_URL + image.filename

    const userProfile = await userValid.save()
    return res.status(200).send({
        status: true,
        message: "True",
        userProfile
    })
})

module.exports = router;