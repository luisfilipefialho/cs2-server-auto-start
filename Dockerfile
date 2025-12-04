FROM node:25-alpine

WORKDIR /

COPY package*.json ./
RUN npm install --production

COPY . .

CMD ["node", "src/index.js"]
