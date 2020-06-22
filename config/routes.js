const routers = require('../routers')

module.exports = (app) => {
    app.use('/', routers.home)
    app.use('/home', routers.home)
    app.use('/user', routers.user)
    app.use('/article', routers.article)

    app.use('*', (req, res, next) => {
        res.send('<h1>Invalid URL!</h1>')
    })
}