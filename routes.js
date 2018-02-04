'use strict';
const fs = require('fs');
const check = require('./check');
const sendxmp = require('./sendxmp');

const sent_message = (tx, address) => `
<html>
  <head>
    <title>XMP Facucet - sent</title>
  </head>
  <body>
    <p>
      Sent some $XMP to <a href="https://mona.insight.monaco-ex.org/insight/tx/${tx}">${address}</a>.
    </p>
    <p>
      Donate if you like it. <a href="monacoin:MV6CvBH1rXNfSZBUEkZwKohDd1qrTg1qA1">monacoin:MV6CvBH1rXNfSZBUEkZwKohDd1qrTg1qA1</a>
    </p>
  </body>
</html>
`;

const configRoutes = (app, server, passport) => {

  app.get('/entry', (req, res) => {
    if (req.session.passport.user) {
      fs.readFile('./entry/index.html', 'utf8', (error, html) => {
        res.send(html);
      });
    } else {
      res.redirect('/');
    }
  });

  app.post('/request', (req, res) => {
    if (req.session.passport.user) {
      check.address(req.body.address)
        .then(() => check.twitterID(req.session.passport.user))
        .then(() => sendxmp.send(req.body.address))
        .then(tx => res.send(sent_message(tx, req.body.address)))
        .then(() => check.register(req.session.passport.user, req.body.address))
        .catch(err => res.send(err.message));
    } else {
      res.redirect('/');
    }
  });

  app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy(err => res.redirect('/bye.html'));
  });

  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect: '/entry',
      failureRedirect: '/' }));
}

module.exports = {configRoutes: configRoutes};
