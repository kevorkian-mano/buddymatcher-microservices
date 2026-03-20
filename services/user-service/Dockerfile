FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm add graphql-tag

COPY . .
RUN npx prisma generate

EXPOSE 4001
CMD ["npm", "start"]
