FROM node:8-onbuild

WORKDIR /usr/src/app
RUN wget -O static/sign-in-with-twitter-gray.png https://g.twimg.com/dev/sites/default/files/images_documentation/sign-in-with-twitter-gray.png
ENTRYPOINT node app.js
