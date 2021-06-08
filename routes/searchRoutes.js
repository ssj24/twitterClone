const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");

router.get("/", (req, res, next) => {
	const payload = createPayload(req.session.user);

    res.status(200).render("searchPage", payload);
});

router.get("/:selectedTab", (req, res, next) => {
	const payload = createPayload(req.session.user);
    payload.selectedTab = req.params.selectedTab;
    res.status(200).render("searchPage", payload);
});

function createPayload(userLoggedIn) {
    return {
        pageTitle: "Search",
        userLoggedIn: userLoggedIn,
        userLoggedInJS: JSON.stringify(userLoggedIn)
    };
};

module.exports = router;