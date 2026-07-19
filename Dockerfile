FROM node:20-alpine AS build
WORKDIR /app

COPY client/package.json ./client/package.json
RUN cd client && npm install

COPY client ./client
RUN cd client && npm run build

COPY server/package.json ./server/package.json
COPY server/package-lock.json ./server/package-lock.json
RUN cd server && npm ci

COPY server ./server

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=build /app/client/dist ./client/dist
COPY --from=build /app/server ./server
RUN cd server && npm ci --omit=dev

ENV NODE_ENV=production
ENV PORT=10000
EXPOSE 10000
CMD ["node", "server/server.js"]
