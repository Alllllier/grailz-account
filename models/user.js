var mongoose = require("mongoose");
var userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    viewHistory: [{
        product_id: String,
        title: String,
        image: String,
    }],
    watchlist: [{
        product_id: String,
        date: String,
        title: String,
        image: String,
        release: String
    }]
});

var User = mongoose.model("User", userSchema);
module.exports = User;