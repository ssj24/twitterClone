const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");

router.get("/:id", (req, res, next) => {
	const payload = {
        pageTitle: "View Post",
        userLoggedIn: req.session.user,
        userLoggedInJS: JSON.stringify(req.session.user),
        postId: req.params.id
    }
    
    res.status(200).render("postPage", payload);
});

module.exports = router;