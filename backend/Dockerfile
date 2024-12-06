# Use Node.js as the base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the server code
COPY . .

# Expose the backend port
EXPOSE 5002

# Command to run your server
CMD ["node", "server.js"]
