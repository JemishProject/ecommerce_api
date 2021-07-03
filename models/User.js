const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    mobile: {
        type: Number,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        minlength: 3,
        maxlength: 50
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024
    },
    firstname: {
        type: String,
        minlength: 3
    },
    lastname: {
        type: String,
        minlength: 3
    },
    image: {
        type: String,
    },
    address:{
        type: String,
    },
},
{
  timestamps: true,
}
)

module.exports = mongoose.model("registers", UserSchema)
