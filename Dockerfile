# syntax=docker/dockerfile:1
FROM node:12-alpine
WORKDIR /app
COPY . .
RUN npm install --production
RUN npm --prefix ./backend install --production
ENV PORT=13337
CMD ["node", "/app/backend/index.js"]
EXPOSE 13337 