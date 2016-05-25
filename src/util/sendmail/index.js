import { logger } from '../logger';

import emailjs from 'emailjs/email';

export default (req, res, options) => {

  let htmlMessage = '';
  let textMessage = '';
  let renderText = function (callback) {
    res.render(options.textPath, options.locals, function (err, text) {
      if (err) {
        callback(err, null);
      } else {
        textMessage = text;
        return callback(null, 'done');
      }
    });
  };

  let renderHtml = function (callback) {
    res.render(options.htmlPath, options.locals, function (err, html) {
      if (err) {
        callback(err, null);
      } else {
        htmlMessage = html;
        return callback(null, 'done');
      }
    });
  };

  let renderers = [];
  if (options.textPath) {
    renderers.push(renderText);
  }

  if (options.htmlPath) {
    renderers.push(renderHtml);
  }

  require('async').parallel(
    renderers,
    function (err, results) {
      if (err) {
        logger.instance.error(err);
        options.error('Email template render failed.', err);
        return;
      }

      let attachments = [];
      let i = 0;
      let emailer = emailjs.server.connect(req.app.config.smtp.credentials);

      if (htmlMessage) {
        attachments.push({ data: htmlMessage, alternative: true });
      }

      if (options.attachments) {
        for (i < options.attachments.length; i++;) {
          attachments.push(options.attachments[i]);
        }
      }

      emailer.send({
        from: options.from,
        to: options.to,
        'reply-to': options.replyTo || options.from,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        text: htmlMessage,
        attachment: attachments
      }, function (err, message) {
        if (err) {
          logger.instance.error(err);
          options.error('Email failed to send.');
          return;
        } else {
          options.success(message);
          return;
        }
      });
    }
  );
};
