const { User } = require('../models')
const jwt = require('../utils/jwt')
const config = require('../config/config')

module.exports = {
    get: {
        login: (req, res, next) => {
            res.render('login.hbs', { pageTitle: "Login" })
        },
        register: (req, res, next) => {
            res.render('register.hbs', { pageTitle: "Register" })
        },
        logout: (req, res, next) => {
            res
                .clearCookie(config.cookie)
                .clearCookie('username')
                .redirect('/home/')

        }
    },
    post: {
        login: (req, res, next) => {
            const { username, password } = req.body;
            User.findOne({ username }).then((user) => {
                Promise.all([user, user.matchPassword(password)])
                    .then(([user, match]) => {
                        if (!match) {
                            res.message = "Invalid username!"
                            redirect('/user/login')
                            return;

                        }
                        const token = jwt.createToken({ id: user._id })
                        res.cookie('x-auth-token', token)
                            .cookie('username', username)
                            .redirect('/home/')
                    }).catch((err) => {

                        res.render('login.hbs', {
                            message: "Username or password is invalid!"
                        });
                    })
            }).catch((err) => {
                res.render('login.hbs', {
                    message: "Username or password is invalid!"
                });
            })

        },
        register: (req, res, next) => {
            const { username, password, repeatPassword } = req.body;
            if (password !== repeatPassword) {
                res.render('register.hbs', {
                    message: "Passwords do not match!"
                });
                return;
            }

            User.create({ username, password })
                .then((registeredUser) => {

                    res
                        .redirect('/user/login')
                }).catch((err) => {
                    if (err.code === 11000 || err.name === "ValidationError") {
                        const message = Object.entries(err.errors).map(tuple => {
                            return tuple[1].message
                        })
                        res.render('register.hbs', { message })
                    }

                })


        }
    }
}