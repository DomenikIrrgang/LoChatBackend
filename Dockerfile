FROM node:carbon
WORKDIR /usr/src/LoChatBackend
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
RUN npm install -g typescript
COPY . .
RUN tsc
EXPOSE 8080
CMD ["npm", "start"]