'use strict';
const http = require('http');
const express = require('express');

const session = require('express-session')
const auth = require('./passport');
const passport = auth.passport;

const bodyParser = require('body-parser');

const routes = require('./routes');

const app = express();
app.use(passport.initialize());
app.use(passport.session());
app.use(session({secret: process.env.SESSION_SECRET}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/static'));

const server = http.createServer(app);

routes.configRoutes(app, server, passport);

server.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port %d in %s mode', server.address().port, app.settings.env);
});
