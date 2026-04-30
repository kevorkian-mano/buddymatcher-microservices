FROM node:20-alpine
WORKDIR /app

COPY package.json ./
RUN npm install
RUN npm add graphql-tag
RUN apk add --no-cache openssl

COPY . .
RUN npx prisma generate

EXPOSE 4001
CMD ["npm", "start"]
