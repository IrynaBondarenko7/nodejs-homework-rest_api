FROM node:18.17

WORKDIR /nodejs-homework-rest_api

COPY . .

RUN npm i

EXPOSE 3000

CMD ["npm", "start"]