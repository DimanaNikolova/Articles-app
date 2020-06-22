const config = require('../config/config')
const { Article } = require('../models')
const { User } = require('../models')

module.exports = {
    get: {
        create: (req, res, next) => {
            res.render('create.hbs', { pageTitle: "Create article" })
        },
        all: (req, res, next) => {
            Article
                .find({})
                .select('title description articleAuthor')
                .lean()
                .then((articles) => {
                    res.render('all-articles.hbs', { articles })
                })
        },
        details: (req, res, next) => {
            const id = req.params.id
            Article
                .findById(id)
                .lean()
                .then(article => {
                    article.isAuthor = article.articleAuthor.toString() === req.user._id.toString()

                    res.render('article.hbs', { article, id })
                })
        },
        edit:(req,res,next)=>{
            const id =req.params.id
            Article.findById(id)
            .lean()
            .then((article)=>{
                res.render('edit.hbs', {article})
            })
        },
        delete:(req,res,next)=>{
            const id =req.params.id
            Article
            .findByIdAndRemove(id)
            .then(()=>{
                res.redirect('/article/all')
            })
        }
    },
    post: {
        create: (req, res, next) => {
            const { title, description } = req.body;
            Article
                .create({ title, description, articleAuthor: req.user._id })
                .then((data) => {
                    // data about the created user
                    req.user.createdArticles.push(data._id)

                    //return!!!

                    return User.findByIdAndUpdate({ _id: req.user._id }, req.user)
                })
                .then((updatedUser) => {
                    // data about the relations
                    res.redirect('/')
                })
                .catch((err) => {
                    if (err.code === 11000 || err.name === "ValidationError") {
                        const message = Object.entries(err.errors).map(tuple => {
                            return tuple[1].message
                        })
                        res.render('create.hbs', { message })
                    }

                })
        },
        edit:(req,res,next)=>{
            const {description}=req.body
            const id =req.params.id
            Article.findByIdAndUpdate({_id: id}, {description})
            .then((article)=>{
                res.redirect(`/article/details/${id}`)
            })
        }
    }
}