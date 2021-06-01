const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");

router.get("/", (req, res, next) => {
	const payload = {
        pageTitle: req.session.user.username,
        userLoggedIn: req.session.user,
        userLoggedInJS: JSON.stringify(req.session.user),
        profileUser: req.session.user
    }
    
    res.status(200).render("profilePage", payload);
});

router.get("/:username", async (req, res, next) => {
	const payload = await getPayload(req.params.username, req.session.user);
    res.status(200).render("profilePage", payload);
});

router.get("/:username/replies", async (req, res, next) => {
	const payload = await getPayload(req.params.username, req.session.user);
    payload.selectedTab = "replies";
    res.status(200).render("profilePage", payload);
});

async function getPayload(username, userLoggedIn) {
    let user = await User.findOne({ username: username });
    if (user == null) {
        if (username.match(/^[0-9a-fA-F]{24}$/)) {
            user = await User.findById(username);
          }
        if (user == null) {
            return {
                pageTitle: "User not found",
                userLoggedIn: userLoggedIn,
                userLoggedInJS: JSON.stringify(userLoggedIn),
            };
        }
    }
    return {
        pageTitle: user.username,
        userLoggedIn: userLoggedIn,
        userLoggedInJS: JSON.stringify(userLoggedIn),
        profileUser: user
    };
}

module.exports = router;