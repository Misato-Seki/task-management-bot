FROM node:18

WORKDIR /app

# .env を先にコピー
COPY ./frontend/.env .env

COPY ./frontend/package*.json ./
RUN npm install

COPY ./frontend ./

RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
