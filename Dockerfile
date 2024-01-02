# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /index

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the project
RUN npm run build

# Expose the port on which the application will run
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
