import mongoose from 'mongoose';

const bcrypt = require('bcrypt');

export default class {

  filterUser(user) {
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      status: user.status,
      photos: user.photos
    };
  }

  get authenticate() {
    let self = this;
    return (username, password, done) => {
      mongoose.model('User').findOne({
        email: username
      }, function (err, user) {
        if (err) {
          return done(err, null);
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password.' });
        } else {
          bcrypt.compare(password, user.password, function (err, result) {
            if (!result) {
              return done(null, false, { message: 'Incorrect email or password.' });
            } else {
              return done(null, self.filterUser(user.toJSON()));
            }
          });
        }
      });
    };
  }
}
