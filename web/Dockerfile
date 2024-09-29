# Use the official Node.js image as the base image
FROM node:alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Install a simple HTTP server to serve the built application
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["serve", "-s", "dist", "-l", "5000"]