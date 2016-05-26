import { logger } from '../util/logger';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export default (req, res) => {

  const email = req.body.email;
  const password = req.body.passw;

  if (!email) {
    res.status(200).json({
      success: false, message: 'Email is required'
    });
  } else if (!password) {
    logger.instance.error('no passwrd');
    res.status(200).json({
      success: false, message: 'Password is required'
    });
  } else {
    req._passport.instance.authenticate('local', function (err, user, info) {
      if (err) {
        logger.instance.error('Error on LocalStragety', err);
      }

      if (!user) {
        // TODO log login attempt
        res.status(200).json({
          success: false,
          message: 'Incorrect email or password.'
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            logger.instance.error('req.login failed,', err);
          }
          res.status(200).json({
            success: true,
            user: req.user
          });
        });
      }
    })(req, res);
  }
};
