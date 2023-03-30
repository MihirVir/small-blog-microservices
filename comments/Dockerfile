#base image
FROM node:alpine
#working dir
WORKDIR /app
#copying package json
COPY package.json ./
#if package changed then reinstall
RUN npm install
COPY ./ ./
#start command
CMD ["npm", "start"]