FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
# CMD ["sh", "-c", "npx prisma migrate dev --name init & npm run dev"]
