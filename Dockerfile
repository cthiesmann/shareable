# syntax=docker/dockerfile:1
FROM node:12-alpine
WORKDIR /app
COPY . .
RUN npm install --production
RUN cd ./backend
RUN npm install --production
ENV PORT=13337
CMD ["node", "./backend/index.js"]
EXPOSE 13337 