FROM node:8-onbuild

WORKDIR /usr/src/app
ENTRYPOINT node app.js
