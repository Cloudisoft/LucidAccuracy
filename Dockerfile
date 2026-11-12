# Build the static site, then serve it (and the contact form API) with Node.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY server ./server
COPY src/data/contact-services.json ./src/data/contact-services.json
EXPOSE 8080
CMD ["node", "server/index.mjs"]
