const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");
const { errorHandler } = require("../auth");

// POST /users/register
module.exports.registerUser = (req, res) => {
    const { userName, email, password } = req.body;

    if (!userName) {
        return res.status(400).send({ error: "Username is required" });
    } else if (!email.includes("@")) {
        return res.status(400).send({ error: "Email invalid" });
    } else if (password.length < 8) {
        return res.status(400).send({ error: "Password must be at least 8 characters" });
    } else {
        return User.findOne({ email })
            .then(existing => {
                if (existing) {
                    return res.status(409).send({ error: "Email already registered" });
                }
                let newUser = new User({
                    userName,
                    email,
                    password: bcrypt.hashSync(password, 10)
                });
                return newUser.save()
                    .then(() => res.status(201).send({ message: "Registered Successfully" }))
                    .catch(err => errorHandler(err, req, res));
            })
            .catch(err => errorHandler(err, req, res));
    }
};

// POST /users/login
module.exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ error: "Email and password are required" });
    }

    if (!email.includes("@")) {
        return res.status(400).send({ error: "Invalid email format" });
    }

    return User.findOne({ email })
        .then(result => {
            if (result == null) {
                return res.status(404).send({ error: "No Email Found" });
            }
            const isPasswordCorrect = bcrypt.compareSync(password, result.password);
            if (isPasswordCorrect) {
                return res.status(200).send({ access: auth.createAccessToken(result) });
            } else {
                return res.status(401).send({ error: "Email and password do not match" });
            }
        })
        .catch(err => errorHandler(err, req, res));
};

// GET /users/details
module.exports.getUserDetails = (req, res) => {
    return User.findById(req.user.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({ error: "User not found" });
            }
            user.password = undefined;
            return res.status(200).send({ user });
        })
        .catch(err => errorHandler(err, req, res));
};