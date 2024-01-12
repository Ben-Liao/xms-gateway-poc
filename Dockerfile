# base image
FROM 460140541257.dkr.ecr.us-east-1.amazonaws.com/node14:latest
LABEL xmc gateway service

# install gettext for envsubst
RUN apt-get update
RUN apt-get install -y gettext-base

RUN envsubst --help
ARG DOMAIN=$DOMAIN
ENV nodeEnv ''

# Create service directory
WORKDIR /service

# Move all files and folders
COPY package*.json ./
COPY src/ ./src
COPY resources/ ./resources

# Install dependancies
RUN npm install
# RUN npm ci --only=production

EXPOSE 8080 9080

CMD [ "npm", "run", "start", "--env=${nodeEnv}" ]
