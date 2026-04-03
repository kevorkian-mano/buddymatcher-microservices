# Base image for building and serving the React app
FROM node:18-alpine

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port 3000 to match Vite default
EXPOSE 3000

# Run Vite development server
CMD ["npm", "run", "dev"]