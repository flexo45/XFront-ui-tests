FROM node:latest

# run from *.Frontend context
WORKDIR /e2e
COPY ./package*.json /e2e/

RUN npm install

COPY . /e2e/

RUN mkdir /e2e/e2e/fails
