const mongoose = require('mongoose');
const Model = mongoose.model

const articleSchema = new mongoose.Schema({
    title:{
        type: mongoose.SchemaTypes.String,
        required:[true, 'Title is required!'],
        unique:[true, 'Article with such name already exists!'],
        minlength:[5, 'Title should be at least 5 characters long!']
    },
    description:{
        type: mongoose.SchemaTypes.String,
        required:[true, 'Description is required!'],
        minlength:[20, "Description should be at least 20 characters long!"]
    },
    articleAuthor:{
        type: mongoose.SchemaTypes.ObjectId, ref: 'User'
    },
    creationDate:{
        type: mongoose.SchemaTypes.Date, default:Date.now
    }
})
module.exports = new Model('Article', articleSchema)