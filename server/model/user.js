import mongoose from 'mongoose';

const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique:true
    },
    email: {
        type: String,
        required: false,
        unique:true

    },
    picture:{
        type: String,
        required: false,
    },
    password:{
        type: String,
        required: true,
    },
    bio:{
        type: String,
        required: false,
    }
})

const user =  mongoose.model('user',userSchema);

export default user;