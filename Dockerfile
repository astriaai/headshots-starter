FROM node:latest

COPY . /home/app

WORKDIR /home/app

EXPOSE 3000

RUN yarn

CMD [ "npm" , "run","dev" ]