# FROM node:lts-alpine
FROM node:lts
WORKDIR /usr/src/app
COPY . .

RUN npm install

USER node
EXPOSE 3000

CMD ["bash","-c", "npm install && npm run dev"]