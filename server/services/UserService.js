const UserModel = require('./../models/Users');
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET || 'secret';

class UserService {
    constructor() {

    }

    create = (data) => {
      return UserModel.create(data)
          .then(user => {
              return user;
          })
          .catch(err => {
             throw err;
          });
    };

    findById = (id) => {
        return UserModel.findById(id).exec()
            .then(user => {
                return user;
            });
    };

    findByEmail = (email) => {
        return UserModel.findOne({email: email}).exec()
            .then(user => {
                return user;
            })
    };

    findByEmailAndUpdate = (email, data) => {
        return UserModel.findOneAndUpdate({email: email}, data).exec()
            .then(user => {
                return user;
            });
    };

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

    verifyJwt = (token) => {
        return jwt.verify(token, secret, (err) => {
            return !err;
        });
    };

}

module.exports = new UserService();
