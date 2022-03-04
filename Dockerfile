FROM node:current-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install

# Bundle app source
COPY . .

EXPOSE 3001

CMD [ "node", "server.js" ]
