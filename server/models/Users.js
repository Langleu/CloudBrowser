import mongoose, {Schema} from 'mongoose';
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 11;

/**
 * @class
 * @description describes the user model.
 * @param email String
 * @param password ObjectId
 * @param date Integer
 */
export const userSchema = new Schema({
        email: { type: String,  lowercase: true,  trim: true,  index: true,  unique: true,  required: true },
        password: { type: String, required: true },
        date: { type: Date, default: Date.now }
    },
    {collection: 'users'}
);

/**
 * @method
 * @description hashes and salts the user password before saving in the database.
 */
userSchema.pre('save', function(next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

/**
 * @method
 * @description allows us to compare a password with the hash entry.
 * @param candidatePassword
 * @param cb
 * @returns {*}
 */
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    return bcrypt.compare(candidatePassword, this.password)
        .then(isMatch => {
            return isMatch
        })
        .catch(err => { throw err });
};

userSchema.index({email: 1});

module.exports = mongoose.model('User', userSchema);
