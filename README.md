## About
XMS gateway.

## Run
// node app locally
$ npm run start --env=local

// node app production
$ npm run start

// Unit tests
$ npm run test

## Build Docker
$ docker build --progress=plain --no-cache -t sf-byot-gateway .

To run the node app locally
$ docker run -e nodeEnv=local -it <image>
