FROM node:latest

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install
ENTRYPOINT ["npm", "start"]
EXPOSE 8888
