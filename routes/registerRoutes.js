const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.urlencoded({
    extended: false
}));

router.get("/", (req, res, next) => {
    res.status(200).render("register");
});
router.post("/", (req, res, next) => {
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const username = req.body.username.trim();
    const email = req.body.email.trim();
    const password = req.body.password;

    const payload = req.body;
    if (firstName && lastName && username && email && password) {

    } else {
        payload.errorMessage = "Make sure each field has a valid value.";
        res.status(200).render("register", payload);
    }
});

module.exports = router;