FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm add jsonwebtoken

COPY . .
RUN npx prisma generate

EXPOSE 4002
CMD ["npm", "start"]
