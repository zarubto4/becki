FROM node:10.11

ARG ssh_prv_key

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# Bundle app source
COPY . .

RUN git init

RUN mkdir -p /root/.ssh && \
    chmod 0700 /root/.ssh && \
    ssh-keyscan github.com > /root/.ssh/known_hosts

RUN echo "$ssh_prv_key" | python -c "key = raw_input();print \"-----BEGIN RSA PRIVATE KEY-----\" + \"\\n\" + \"\\n\".join(key[i:i+64] for i in range(0, len(key), 64)) + \"\\n\" + \"-----END RSA PRIVATE KEY-----\"" >  /root/.ssh/id_rsa

RUN chmod 600 /root/.ssh/id_rsa

RUN npm install
RUN npm run build

FROM nginx

COPY --from=0 /usr/src/app/dist /usr/src/app/dist
RUN rm /etc/nginx/conf.d/default.conf
COPY ngconf /etc/nginx/conf.d/default.conf

RUN service nginx start

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


