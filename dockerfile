FROM node:alpine

# Install pnpm
RUN npm install -g pnpm nodemon

WORKDIR /app

# Copy package files from the server directory
COPY server/package.json server/pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the server code
COPY server/ .

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["pnpm", "run", "dev"]