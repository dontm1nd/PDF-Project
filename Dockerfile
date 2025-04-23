FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Prisma Client generieren
RUN npx prisma generate

# Remix build
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
