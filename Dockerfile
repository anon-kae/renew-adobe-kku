# Stage 1: Build
FROM node:slim as builder

WORKDIR /app

# Install dependencies required for your build
RUN apt-get update && apt-get install -y wget gnupg \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable \
  --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copy package.json and install dependencies
COPY package.json /app/
RUN npm install

# Copy the rest of your application
COPY . /app

# Stage 2: Runtime
FROM node:slim

WORKDIR /app

# Copy built node modules and built artifacts from Stage 1
COPY --from=builder /app /app

# Environment variables
ENV USERNAME=Ja_nawarut
ENV DOMAIN=@kkumail.com
ENV PASSWORD=ja23102543
ENV URL=https://oauth.kku.ac.th/authorize?client_id=33ee975f82e6d6ec&redirect_uri=http%3A%2F%2Fapp-reserve.kku.ac.th%2Fuser%2Fcallback&response_type=code&state=
ENV DURATION=week

# Start the application
CMD ["node", "main.js"]
