const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true, 
        unique: true,
        minlength: 4,
    }, 
    password: {
        type: String,
        required: true,
        minlength: 7
    },
    rol: {
        type: String,
        required: true, 
        enum: ["admin", "physio", "patient"]
    }
});

let User = mongoose.model("user", userSchema);
module.exports = User; 