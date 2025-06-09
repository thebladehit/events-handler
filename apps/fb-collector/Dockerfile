FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install

COPY apps/fb-collector apps/fb-collector
COPY libs libs

RUN cd apps/fb-collector && npm install

RUN npx prisma generate --schema=libs/common/src/prisma
RUN npm run build fb-collector

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/fb-collector/main"]