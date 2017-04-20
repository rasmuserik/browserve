FROM node:latest

RUN apt-get update && apt-get install -y xvfb libgtk2.0-0
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install
ENTRYPOINT ["npm", "start"]
EXPOSE 8888
