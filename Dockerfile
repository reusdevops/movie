# Development Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm install

# Copy source code
COPY . .

# Expose the application port
EXPOSE 3000

# Set environment to development
ENV NODE_ENV=development

# Start in development mode with hot reload
CMD ["npm", "run", "start:dev"]