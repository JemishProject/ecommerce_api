const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    mobile: {
        type: Number,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
},
{
  timestamps: true,
}
)

module.exports = mongoose.model("registers", UserSchema)
