# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the app's port
EXPOSE 4000

# Command to run the app
CMD ["node", "index.js"]
