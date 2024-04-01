# Use an official Node.js runtime as the base image
FROM node:latest

# Set the working directory in the container to /app
WORKDIR /app

# Set environment variable
ENV PATH /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ENV YARN_VERSION 1.22.19
ENV TZ Europe/Zurich

# Copy the current directory contents into the container at /app
COPY . /app

# Install project dependencies
RUN apt-get update && apt-get install -y \
    apt-utils \
    sqlite3 \
    mariadb-client \
    netcat-openbsd \
    python-is-python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Update npm to the latest version
RUN npm install -g npm@latest
RUN npm install -g nodemon@latest

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Run the application when the container launches
# commande pour un lancement normal en mode hors nodemon
CMD ["node", "--inspect=0.0.0.0:9229", "server.js"]