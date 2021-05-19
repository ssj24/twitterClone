const mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

class Database {

    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect("mongodb+srv://test:qwer1234@twitterclonecluster.ar82m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
        .then(() => {
            console.log("database connection successful");
        })
        .catch((err) => {
            console.log("database connection error", err);
        })
    }
}

module.exports = new Database();