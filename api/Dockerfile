# Use an official Node.js runtime as a parent image with a specific version
FROM node:alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application (if applicable)
# RUN npm run build

# Use a smaller base image for the final image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app /app

# Expose the port the app runs on
EXPOSE 8000

# Create a non-root user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Define the command to run the app
CMD ["npm", "start"]