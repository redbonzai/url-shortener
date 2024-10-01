# Step 1: Use Node.js as the base image
FROM node:22-alpine

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy the package.json and package-lock.json to the working directory
# Only copy pnpm-lock.yaml if it exists in your project
COPY package.json ./
COPY pnpm-lock.yaml ./

# Step 4: Install pnpm globally
RUN npm install -g pnpm

# Step 5: Install app dependencies
RUN pnpm install

# Step 6: Copy the rest of the application code
COPY . .

# Step 7: Build the app (if necessary, depending on your app setup)
RUN pnpm run build

# Step 8: Add bash (if you need bash)
RUN apk add --no-cache bash

# Step 9: Expose the app's port (make sure this matches the port your app is using)
EXPOSE 3250

# Step 10: Start the NestJS application
CMD ["pnpm", "run", "start:dev"]
