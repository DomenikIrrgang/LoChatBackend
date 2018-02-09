FROM node:carbon
WORKDIR /usr/src/lochatbackend
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
RUN npm install -g typescript
RUN npm install -g typedoc
COPY . .
RUN tsc
RUN mkdir docs
RUN typedoc --mode modules --out ./docs ./src
RUN mkdir logs
EXPOSE 8080
CMD ["npm", "start"]