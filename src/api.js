import mongoose from 'mongoose';

export default(app, logger) => {

  let sendErr = function(res, msg) {
    res.status(200).json({
      success: false, message: msg
    });
  };

  return {
    write: function (req, res) {
      let body = req.body;
      let message;

      if (body === null || typeof body !== 'object') {
        sendErr(res, 'request is empty');
      } else {
        if (body.message === null || body.message === undefined) {
          sendErr(res, 'message is missing from request body');
        } else {
          message = {
            message: body.message
          };

          if (body.level) {
            message.level = body.level;
          }

          if (body.topic) {
            message.topic = body.topic;
          }

          if (body.author) {
            message.author = body.author;
          }

          logger.info(message);

          mongoose.model('Message').create(message, function(err, doc) {
            if (err) {
              logger.error(err);
            }

            logger.debug('message saved');

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
              success: true, message: 'saved'
            });
          });
        }
      }
    },
    read: function (req, res) {
      let skip = req.query.skip || 0;
      let limit = req.query.limit || 100;

      mongoose.model('Message').find().skip(skip).limit(limit).sort('-author').exec(function(err, messages) {
        if (err) {
          logger.error(err);
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(messages);
      });
    }
  };
}

