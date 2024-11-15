FROM node:alpine
WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install

COPY ./.env ./
COPY ./config ./config
COPY ./controllers ./controllers
COPY ./model ./model
COPY ./routes ./routes
COPY ./utils ./utils
COPY ./server.js ./server.js
COPY ./index.js ./index.js

CMD [ "npm", "start" ]