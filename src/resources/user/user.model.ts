import { Schema, model } from "mongoose";
import User from "./user.interface";
import bcrypt from 'bcryptjs'


const userSchema = new Schema<User> ({
    name: {
        type: String,
        required: [true, 'Please enter your first name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter your passwrod']
    },
    role: {
        type: String,
        enum: ['user', 'virtual assistant', 'admin'],
        default: 'user', 
    },
}, {
    toJSON: {
        transform: function (doc, ret) {
          delete ret.password;
        },
      },
      timestamps: true
})

userSchema.pre('save', async function(next): Promise<void> {
    if(!this.isModified('password')) return next()

    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function(inputedPassword:string) {
    return await bcrypt.compare(inputedPassword, this.password)
}

export default model('User', userSchema)