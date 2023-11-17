const router = require("express").Router();
const Helper = require("../helper/helper");
const { User } = require("../model/index");

router.post("/register", async (req, res, next) => {
    try {
        const { username, email, password, phoneNumber, address } = req.body;
        const userData = {
            username,
            email,
            password,
            phoneNumber,
            address,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        if (!username || !email || !password) {
            throw {
                name: "INVALID_INPUT",
                message: "Missing one or more input in post register"
            };
        }

        // Validate for unique username and email
        const newUser = await User.findOrCreate(username, email, userData);
        if (!newUser) {
            throw {
                name: "ALREADY_EXIST",
                message: "Username or email already exist"
            };
        }
        console.log(newUser);
        res.status(201).json({ message: "New user successfully created", id: newUser });
    } catch (err) {
        next(err);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username) {
            throw {
                name: "INVALID_INPUT",
                message: "Missing username in post login"
            };
        }
        if (!password) {
            throw {
                name: "INVALID_INPUT",
                message: "Missing password in post login"
            };
        }
        const user = await User.findByUsername(username);
        if (!user) {
            throw {
                name: "INVALID_CREDENTIAL",
                message: "Username or password is incorrect"
            };
        }
        const isValidPassword = Helper.comparePassword(password, user.password);
        if (!isValidPassword) {
            throw {
                name: "INVALID_CREDENTIAL",
                message: "Username or password is incorrect"
            };
        }
        const payload = {
            id: user._id,
            email: user.email,
            username: user.usename
        };

        const access_token = Helper.generateToken(payload);
        res.status(200).json({ access_token });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
