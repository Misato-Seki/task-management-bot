FROM node:18

WORKDIR /app

COPY .env .env
COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
