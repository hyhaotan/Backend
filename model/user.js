import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    email:{
        type: String,
        require: true,
        unique: true,
    },
    password:{
        type: String,
        require: true,
        minlength: 6,
    },
    age: {
        type: Number,
    }
},
    { timestamps: true, versionKey: false }
);


export default mongoose.model("User", userSchema)