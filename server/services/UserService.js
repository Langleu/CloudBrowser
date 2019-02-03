const UserModel = require('./../models/Users');
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET || 'secret';

/**
 * @class
 * The UserService implementation which is the abstraction for the UserModel.
 */
class UserService {
    constructor() {

    }

    /**
     * @description creates a user.
     * @param data consists of email and password.
     * @returns user
     */
    create = (data) => {
      return UserModel.create(data)
          .then(user => {
              return user;
          })
          .catch(err => {
             throw err;
          });
    };

    /**
     * @description find database entry through userId.
     * @param id
     * @returns {Promise<any | never>}
     */
    findById = (id) => {
        return UserModel.findById(id).exec()
            .then(user => {
                return user;
            });
    };

    /**
     * @description find database entry through email.
     * @param email
     * @returns {Promise<any | never>}
     */
    findByEmail = (email) => {
        return UserModel.findOne({email: email}).exec()
            .then(user => {
                return user;
            })
    };

    /**
     * @description find entry and update it.
     * @param email
     * @param data
     * @returns {Promise<any | never>}
     */
    findByEmailAndUpdate = (email, data) => {
        return UserModel.findOneAndUpdate({email: email}, data).exec()
            .then(user => {
                return user;
            });
    };

    /**
     * @description authenticate email/password combo.
     * @param email
     * @param password
     * @returns {Promise<any | never | never>}
     */
    authenticate = (email, password) => {
      return this.findByEmail(email)
          .then(user => {
              return user.comparePassword(password)
                  .then(isMatch => {
                      return {user, isMatch};
                  });
          })
          .catch(err => {
              throw new err;
          });
    };

    /**
     * @description creates jwt from given user object.
     * @param user
     * @returns {*}
     */
    createJwt = (user) => {
        return jwt.sign({
                email: user.email,
                _id: user._id
            },
            secret,
            {
                expiresIn: '30d'
            });
    };

    /**
     * @description verifies that the jwt is still valid.
     * @param token
     * @returns {*}
     */
    verifyJwt = (token) => {
        return jwt.verify(token, secret, (err) => {
            return !err;
        });
    };

    /**
     * @description decodes a jwt back to json object.
     * @param token
     * @returns {*}
     */
    decodeJwt = (token) => {
        return jwt.decode(token);
    };
}

module.exports = new UserService();
