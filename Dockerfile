FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
RUN npm install --omit=dev

COPY dist/ ./dist/
COPY server.js ./server.js

EXPOSE 8080

CMD ["npm", "start"]
