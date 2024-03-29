FROM node:18.12.1-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --omit=dev
COPY . .
ENV PORT 3000
EXPOSE 3000
CMD ["node","index.js"]