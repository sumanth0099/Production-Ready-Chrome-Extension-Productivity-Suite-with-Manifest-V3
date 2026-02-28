# Build stage
FROM node:20-alpine AS builder

# Install zip utility
RUN apk add --no-cache zip

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Generate the zip file
RUN zip -r productivity_suite.zip dist/

# Final stage to export the artifact
FROM scratch AS export
COPY --from=builder /app/productivity_suite.zip /
