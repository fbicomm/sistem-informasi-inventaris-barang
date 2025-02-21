FROM node:22-alpine

RUN apk add make g++
RUN apk add python3 py3-pip
RUN apk add pkgconfig pixman-dev cairo-dev pango-dev

RUN mkdir -p /app/node_modules
RUN chown -R node:node /app

WORKDIR /app
COPY package*.json ./
USER node

COPY --chown=node:node . .
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]