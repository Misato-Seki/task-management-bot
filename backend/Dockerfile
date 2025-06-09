FROM node:18

# Create app directory
WORKDIR /app
# Install app dependencies
COPY package*.json ./
RUN npm install
# Bundle app source
COPY . .
# generate Prisma client
RUN npx prisma generate
EXPOSE 8000
CMD ["node", "src/index.js"]