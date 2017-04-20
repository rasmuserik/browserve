FROM node:latest

RUN RUN apt-get update && apt-get install -y xvfb
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install
ENTRYPOINT ["npm", "start"]
EXPOSE 8888
