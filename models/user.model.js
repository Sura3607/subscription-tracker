import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required: [true, "User name is required"],
        trim : true,
        minLength : 2,
        maxLength: 50,
    },
    email:{
        type: String,
        required: [true,"User email is required"],
        unique: true,
        trim: false,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
    },
    password:{
        type: String,
        required: [true, "User password is required"],
        minLength: 6,
    }
}, {timestamps: true});

const User = mongoose.model('User',userSchema)

export default User;