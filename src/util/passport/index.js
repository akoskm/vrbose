import passport from 'passport';
import mongoose from 'mongoose';
import passportLocal from 'passport-local';
import CustomStrategy from './strategy-local';

export default(app) => {

  // passpost strategy
  const LocalStrategy = passportLocal.Strategy;

  app.use(passport.initialize());
  app.use(passport.session());

  let customStrategy = new CustomStrategy();
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'passw'
  }, customStrategy.authenticate));

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (_id, done) {
    if (mongoose.Types.ObjectId.isValid(_id)) {
      mongoose.model('User').findById(_id, function (err, user) {
        if (err) {
          done(err, null);
        }
        if (user) {
          done(null, customStrategy.filterUser(user.toJSON()));
        }
      });
    } else {
      done('Invalid authentication request', null);
    }
  });
}
