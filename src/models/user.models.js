import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name field is a required field.'],
        trim: true,
        
    },
    email: {
        type: String,
        required: [true, 'Email is a required field.'],
        match:[ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , 'Please enter a valid email address.'] 
    },
    password: {
        type: String,
        required: [true, 'Password is a required field.'],
        minLength: [4, 'Password should be of minimum length of 4 characters.'],
        maxLength: [10, 'Password should be of maximum length of 10 characters.'],
        select: false
    },
    currentProject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        default: null
    }
},{timestamps: true})

userSchema.pre('save', async function() {
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = function() {
    return jwt.sign(
        {
            userId: this._id
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: process.env.TOKEN_EXPIRY
        }
    )
}


export const User = new mongoose.model('User', userSchema);