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

      if (body === null || typeof body !== 'object' || typeof body.log !== 'object') {
        sendErr(res, 'request body is missing');
      } else {
        let log = body.log;
        if (log.data === null || log.data === undefined) {
          sendErr(res, 'message is missing from request body');
        } else if (log.createdBy === null || log.createdBy === undefined) {
          sendErr(res, 'createdBy is missing from request body');
        } else {
          message = {
            data: log.data,
            author: log.createdBy,
            level: log.level,
            topic: log.topic
          };

          console.log(message);

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

      mongoose.model('Message').find().skip(skip).limit(limit).sort('-createdBy').exec(function(err, messages) {
        if (err) {
          logger.error(err);
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(messages);
      });
    }
  };
}

