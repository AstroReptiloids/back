##BUILD##
FROM node:13.14.0
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm i
RUN npm run build
EXPOSE 3000
RUN mkdir out
RUN npm run seed

CMD [ "npm", "start", "/app/dist/server.js" ]