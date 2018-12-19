FROM node:10.11


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# Bundle app source
COPY . .

RUN git init
RUN lsb_release -a
ARG ssh_prv_key
ARG ssh_pub_key

RUN mkdir -p /root/.ssh && \
    chmod 0700 /root/.ssh && \
    ssh-keyscan github.com > /root/.ssh/known_hosts

RUN echo "$ssh_prv_key" > /root/.ssh/id_rsa && \
    echo "$ssh_pub_key" > /root/.ssh/id_rsa.pub && \
    chmod 600 /root/.ssh/id_rsa && \
    chmod 600 /root/.ssh/id_rsa.pub

RUN npm install
RUN npm run build

FROM nginx
COPY ngconf /ectc/ngnix/sites-available/default
RUN service nginx start

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]


