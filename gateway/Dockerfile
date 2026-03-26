FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Install wget
RUN apk add --no-cache wget

COPY . .

# Copy the wait-for script and give it execution permissions
COPY wait-for-services.sh .
RUN chmod +x wait-for-services.sh

EXPOSE 4000
CMD ["./wait-for-services.sh", "npm", "start"]
