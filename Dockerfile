# 1. Base image
FROM node:18-alpine

# 2. Working directory
WORKDIR /app

# 3. Copy package files & install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy rest of the code
COPY . .

# 5. Build Next.js
RUN npm run build

# 6. Expose & run
EXPOSE 3000
CMD ["npm", "start"]
