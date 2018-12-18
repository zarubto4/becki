FROM node:10.11
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

ARG ssh_prv_key
RUN mkdir /root/.ssh/
RUN echo "${ssh_prv_key}" > /root/.ssh/id_rsa

RUN touch /root/.ssh/known_hosts
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts


ENV TEST_VAR_1  "Zestovací String 1"
ENV TEST_VAR_2  "Ověřovací String 2"
ENV TEST_VAR_3  "Prototypovací String 2"

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ “npm”, “start” ]
