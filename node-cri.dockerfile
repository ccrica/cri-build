# Use an official Node.js runtime as the base image
FROM node:latest

# Set the working directory in the container to /app
WORKDIR /app

# Set environment variable
ENV PATH /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ENV YARN_VERSION 1.22.19

# Copy the current directory contents into the container at /app
COPY . /app

# Install project dependencies
RUN apt-get update
RUN apt-get install -y apt-utils
RUN apt-get install -y sqlite3
RUN apt-get install -y mariadb-client
RUN apt-get install -y netcat-openbsd
#RUN apt-get install -y sqlite3
RUN apt-get install -y \
    python-is-python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Remove the lines that install express, nodemon, https, pem, and sqlite3 globally
# RUN npm install -g express
RUN npm install -g nodemon
# RUN npm install -g https
# RUN npm install -g pem
# RUN npm install -g sqlite3

# Update npm to the latest version
RUN npm install -g npm@latest

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Run the application when the container launches
CMD ["nodemon", "--watch", "sql","--watch", "/var_env/ls", "-e", "js,sql,html,css,py", "server.js"]