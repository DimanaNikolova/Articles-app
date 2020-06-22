const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Model = mongoose.model

const userSchema = new mongoose.Schema({
    username: {
        unique: [true, "This username is already taken!"],
        required:[true, 'Username is required!'],
        type: String
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
    },
    createdArticles:
        [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Article'
        }]

});

userSchema.methods = {
    matchPassword: function (password) {
        return bcrypt.compare(password, this.password)
    }
}

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) { next(err); return; }
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) { next(err); return; }
                this.password = hash;
                next();
            });
        });
        return;
    }
    next()
})

module.exports = new Model('User', userSchema)