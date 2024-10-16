FROM node:slim

WORKDIR /usr/app
COPY package*.json ./
RUN npm ci
COPY . .

CMD ["npm", "start"]
