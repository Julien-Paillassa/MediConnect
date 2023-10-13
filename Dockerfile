FROM node:18.16.0-alpine3.17
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
EXPOSE 3000
CMD [ "npm", "run", "start:dev" ]