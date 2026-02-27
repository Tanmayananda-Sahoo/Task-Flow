import {User} from '../models/user.models.js';

const register = async(req,res) => {
    const {name, email, password} = req.body;
    if([name, email, password].some((field) => field.trim() == '')) {
        return res.status(401)
        .json({
            message: 'All fields are required.'
        })
    }

    if(!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        return res.status(401)
        .json({
            message: 'Please enter a email address in valid format.'
        })
    }

    const userExists = await User.findOne({email});
    if(userExists) {
        return res.status(401)
        .json({
            message: 'User already exists.'
        })
    }

    const createdUser = await User.create({
        name,
        email,
        password
    })

    const token = createdUser.generateToken();
    if(!token) {
        return res.status(401)
        .json({
            message: 'Token could not be generated.'
        })
    }

    return res.status(201)
    .cookie('Token', token, {
        httpOnly: true,
        secure: true
    })
    .json({
        message: 'User created successfully.',
        user: createdUser
    })
}

const login = async(req,res) => {
    const {email, password} = req.body;
    if([email, password].some((field) => field.trim() == '')) {
        return res.status(401)
        .json({
            message: 'All fields are required.'
        })
    }

    if(!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        return res.status(401)
        .json({
            message: 'Please enter a email address in valid format.'
        })
    }

    const userExists = await User.findOne({email}).select('+password');
    if(!userExists) {
        return res.status(401)
        .json({
            message: 'User does not exists. Please register.'
        })
    }

    const isPasswordValid = await userExists.comparePassword(password);
    if(!isPasswordValid) {
        return res.status(401)
        .json({
            message: 'The password is not valid.'
        })
    }

    const token = userExists.generateToken();
    if(!token) {
        return res.status(401)
        .json({
            message: 'Token could not be generated.'
        })
    }

    const returnedUser = await User.findOne({email});

    return res.status(200)
    .cookie('Token', token, {
        secured: true,
        httpOnly: true
    })
    .json({
        message: 'User logged in successfully.',
        user: returnedUser
    })
    
}

const logout = async(req,res) => {
    const user = req.user;
    return res.status(200)
    .clearCookie('Token', {
        secured: true,
        httpOnly: true
    })
    .json({
        message: 'User logged out successfully.'
    })
}
export {register, login, logout}