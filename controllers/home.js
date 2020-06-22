const config = require('../config/config')
const Article = require('../models/Article')

module.exports = {
    get: {
        home: (req, res, next) => {

            Article.find()
                .sort('-creationDate')
                .limit(3)
                .lean()
                .then(articles => {
                    articles.forEach(a => {
                        a.description = a.description.split(' ').slice(0, 50).join(' ')
                    });
                    res.render('index.hbs',{articles})
                })
        }
    }
}