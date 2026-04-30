FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install
RUN apk add --no-cache openssl

COPY . .
RUN npx prisma generate

EXPOSE 4006
CMD ["npm", "start"]
