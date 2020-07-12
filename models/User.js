const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    googleId:{
        type: String,
        required: true
    },
    displayName:{
        type: String,
        required: true
    },
    givenName:{
        type: String
    },
    familyName:{
        type: String
       
    },
    image:{
        type: String,
      
    },
    createAt:{
        type: Date,
        default: Date.now
    }
});



module.exports = mongoose.model('User', UserSchema);
