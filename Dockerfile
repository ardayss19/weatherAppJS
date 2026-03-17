# slim → a smaller, lightweight Linux version (faster downloads, smaller images)
FROM node:22-slim 
# Create a folder called /app and do everything inside it from now on
WORKDIR /app
# Copy my project’s dependency files into the container
COPY package*.json ./ 
# Install the exact dependencies listed in the lock file.
RUN npm ci 
# copy all the project files into containers
COPY . .
# this is port that will be used 
ENV PORT=5000
# commands
CMD ["node", "app.js"]