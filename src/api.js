import React from 'react';
import signin from './services/signin';
import signout from './services/signout';
import { profileApi } from './services/profile';
import { watcherApi } from './services/watchers';
import { renderToString } from 'react-dom/server';
import { routes } from './routes';
import { match, RoutingContext } from 'react-router';

export default (app, upload) => {

  /* non-react routes */
  app.post('/api/login', signin);
  app.post('/api/logout', signout);
  app.get('/api/profile', profileApi.profile);

  app.get('/api/watchers', watcherApi.list);
  app.get('/api/watchers/:id', watcherApi.find);
  app.get('/api/watchers/:id/history', watcherApi.getHistory);
  app.get('/api/watchers/:id/activity', watcherApi.activity);

  /* main router for reactjs components, supporting both client and server side rendering*/
  let sendHtml = function (res, props, context) {
    const markup = renderToString(<RoutingContext {...props} params={{ context }}/>);
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>vrbose</title>
        <meta name=viewport content="width=device-width, initial-scale=1">
      </head>
      <script>
        window.APP_STATE = '${context}';
      </script>
      <body>
        <div id="app">${markup}</div>
        <script src="/dist/bundle.js"></script>
      </body>
    </html>
    `);
  };

  app.get('*', (req, res, next) => {
    match({ routes, location: req.url }, (err, redirectLocation, props) => {
      if (err) {
        res.status(500).send(err.message);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (props) {
        let context = '';

        sendHtml(res, props, context);

      } else {
        res.sendStatus(404);
      }
    });
  });
};
