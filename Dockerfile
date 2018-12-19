FROM node:10.11


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# Bundle app source
COPY . .

RUN git init

RUN echo "$ssh_prv_key"
RUN echo ssh_prv_key
RUN mkdir -p /root/.ssh && \
    chmod 0700 /root/.ssh && \
    ssh-keyscan github.com > /root/.ssh/known_hosts

RUN echo "$ssh_prv_key" > /root/.ssh/id_rsa && \
    echo "$ssh_pub_key" > /root/.ssh/id_rsa.pub && \
    chmod 600 /root/.ssh/id_rsa && \
    chmod 600 /root/.ssh/id_rsa.pub

RUN npm install
RUN npm run build
RUN ls /usr/src/app

FROM nginx

COPY --from=0 /usr/src/app/dist /usr/src/app/dist
RUN rm /etc/nginx/conf.d/default.conf
COPY ngconf /etc/nginx/conf.d/default.conf
RUN echo "deb http://ftp.debian.org/debian stretch-backports main" >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install python-certbot-nginx -t stretch-backports

RUN service nginx start

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


